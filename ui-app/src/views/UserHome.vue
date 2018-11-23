<template>
  <div class="userhome">
    <div class="container">
      <div class="columns">
        <div class="column col-6">
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">Bongaukset</div>
                <div class="card" v-for="o in observations" v-on:click="scrollMap(o)">
                  <div class="card-header">
                    <div class="card-title h5">{{o.species}}</div>
                  </div>
                  <div class="card-body">
                    {{o.comment}}
                  </div>
                </div>
            </div>
            <div class="panel-nav">
              <!-- navigation components: tabs, breadcrumbs or pagination -->
            </div>
            <div class="panel-body">
              <!-- contents -->
            </div>
            <div class="panel-footer">
              <div class="columns">
                <div class="column col-6">
                  <button class="btn left" v-on:click="previousPage" v-if="lastVisible != null && firstPageLast.id != lastVisible.id">Takaisin</button>
                </div>
                <div class="column col-6">
                  <button class="btn btn-primary right" v-on:click="nextPage" v-if="lastVisible != null">Eteenpäin</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column col-6">
          <mgl-map
            ref="mapComponent"
            :accessToken="accessToken"
            :mapStyle.sync="mapStyle"
            :center="coordinates"
            :zoom="13"
            @dblclick="mapEventHandler($event)">
            <mgl-marker v-for="observation in observations" :coordinates="[observation.location.longitude, observation.location.latitude]" color="blue"></mgl-marker>
          </mgl-map>
        </div>
      </div>
    </div>

    <div class="modal modal-lg" id="add-modal" v-bind:class="{active: addModalOpen}">
      <a class="modal-overlay" href="#modals-sizes" aria-label="Close"></a>
      <div class="modal-container" role="document" @keydown.enter="saveObservation">
        <div class="modal-header"><a class="btn btn-clear float-right" href="#modals-sizes" aria-label="Close" v-on:click="toggleModal"></a>
          <div class="modal-title h5">Lisää havainto</div>
        </div>
        <div class="modal-body">
          <div class="content">
            <div class="form-group">
              <label class="form-label" for="input-name">Laji</label>
              <input class="form-input" type="text" id="input-name" placeholder="Laji" v-model="observation.species">
            </div>

            <div class="form-group">
              <label class="form-label" for="input-latitude">Paikka: Leveysaste</label>
              <input class="form-input" type="text" id="input-latitude" placeholder="Leveysaste" v-model="observation.latitude">
            </div>
            <div class="form-group">
              <label class="form-label" for="input-longitude">Paikka: Pituusaste</label>
              <input class="form-input" type="text" id="input-longitude" placeholder="Pituusaste" v-model="observation.longitude">
            </div>
            <div class="form-group">
              <label class="form-label" for="input-comment">Kommentti</label>
              <textarea class="form-input" id="input-comment" placeholder="Komimentti" rows="3" v-model="observation.comment"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a class="btn btn-link" href="#modals-sizes" v-on:click="toggleModal">Sulje</a>
          <a class="btn btn-primary" href="#modals-sizes" v-on:click="saveObservation">Tallenna</a>
        </div>
      </div>
    </div>

  </div>
</template>
<style>
  .mapboxgl-map { height: 900px; }
  .mapboxgl-map canvas {display:block;}
  .card {margin-bottom: 10px}
  .left {float: left}
  .right {float: right}
</style>

<script>
  // @ is an alias to /src
  import firebase from "firebase"
  import db from '../main.js'
  import { MglMap, MglMarker } from 'vue-mapbox'
  import { VueContext } from 'vue-context';

  const pageLimit = 25

  function renderSnapshot(snapshot, self, back) {
    if(snapshot.docs.length >= pageLimit) {
      self.lastVisible = snapshot.docs[snapshot.docs.length - 1];
    }
    self.observations = snapshot.docs.map(i => i.data())
  }

  export default {
    name: 'userhome',
    data() {
      return {
        accessToken: 'pk.eyJ1IjoiaG55Ym9tIiwiYSI6ImNqbzhqd2NzbTAwMXUza3JycmFhaTF0aDkifQ.zVDdT2o1dBHB7TjqbGSzRg',
        mapStyle: "mapbox://styles/mapbox/basic-v9",
        coordinates : [23.7603118, 61.4980214],
        addModalOpen: false,
        lastVisible: null,
        firstPageLast: null,
        observation: {
          species: '',
          latitude: null,
          longitude: null,
          comment: '',
        },
        observations : []
      }
    },
    created() {

    },
    mounted() {
      //this.updateObservations()
      this.listenToChanges()
    },
    methods: {
      toggleModal: function(event) {
        this.addModalOpen = !this.addModalOpen
      },
      saveObservation: function(event) {
        db.collection('Observation').add( {
          species: this.observation.species,
          location: new firebase.firestore.GeoPoint(
            this.observation.latitude,
            this.observation.longitude
          ),
          comment: this.observation.comment,
          timestamp: new firebase.firestore.Timestamp.fromDate(new Date()),
          userid: firebase.auth().currentUser.uid
        }).then((docref) => {
          console.log("Document written with ID: ", docref.id);
          this.toggleModal(event);
        }).catch((err) => {
          console.log("ERROR: " + JSON.stringify(err))
        })

      },
      listenToChanges() {
        const self = this
        db.collection('Observation')
          .where('userid', '==', firebase.auth().currentUser.uid)
          .orderBy('timestamp', 'desc')
          .limit(pageLimit)
          .onSnapshot(snapshot => {
            if(snapshot.docs.length > 0) {
              self.firstPageLast = snapshot.docs[snapshot.docs.length - 1];
            }
            renderSnapshot(snapshot, self);
          })
      },
      scrollMap(observation) {
        console.log(JSON.stringify(observation))
        this.$refs.mapComponent.panTo([observation.location.longitude, observation.location.latitude], {})
      },
      nextPage() {
        const self = this
        db.collection('Observation')
          .where('userid', '==', firebase.auth().currentUser.uid)
          .orderBy('timestamp', 'desc')
          .startAfter(this.lastVisible)
          .limit(pageLimit)
          .get().then(snapshot => {
            renderSnapshot(snapshot, self);
          })
      },
      previousPage() {
        const self = this
        db.collection('Observation')
          .where('userid', '==', firebase.auth().currentUser.uid)
          .orderBy('timestamp', 'desc')
          .endAt(this.lastVisible)
          .limit(pageLimit)
          .get().then(snapshot => {
            renderSnapshot(snapshot, self);
          })
      },
      mapEventHandler (e) {
        this.observation.latitude = e.lngLat.lat
        this.observation.longitude = e.lngLat.lng
        this.addModalOpen = true

      }
    },
    components: {
      MglMap, MglMarker, VueContext
    },
  };
</script>
