package fi.solita.hnybom.ktor



import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.fasterxml.jackson.databind.SerializationFeature
import io.ktor.application.*
import io.ktor.auth.Authentication
import io.ktor.auth.UserIdPrincipal
import io.ktor.auth.authenticate
import io.ktor.auth.jwt.jwt
import io.ktor.auth.principal
import io.ktor.features.ContentNegotiation
import io.ktor.http.*
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import java.util.*

open class SimpleJWT(val secret: String) {
    private val algorithm = Algorithm.HMAC256(secret)
    val verifyer = JWT.require(algorithm).build()
    fun sign(name: String): String = JWT.create().withClaim("name", name).sign(algorithm)

}

class User(val name: String, val password: String)

val users = Collections.synchronizedMap(
        listOf(User("test", "test"))
                .associateBy { it.name }
                .toMutableMap()
)

class LoginRegister(val user: String, val password: String)

data class PostSnippet(val snippet: PostSnippet.Text) {
    data class Text(val text: String)
}

data class Snippet(val user: String, val text: String)

val snippets = Collections.synchronizedList(mutableListOf(
        Snippet(user = "test", text = "hello"),
        Snippet(user = "test", text = "world")
))


fun main(args: Array<String>) {
    val simpleJWT = SimpleJWT("verriii-secret")
    val server = embeddedServer(Netty, port = 8080) {
        install(Authentication) {
            jwt {
                verifier(simpleJWT.verifyer)
                validate {
                    UserIdPrincipal(it.payload.getClaim("name").asString())
                }
            }
        }
        install(ContentNegotiation) {
            jackson {
                enable(SerializationFeature.INDENT_OUTPUT) // Pretty Prints the JSON
            }
        }
        routing {
            post("/login-register") {
                val post = call.receive<LoginRegister>()
                val user = users.getOrPut(post.user) { User(post.user, post.password) }
                if (user.password != post.password) error("Invalid credentials")
                call.respond(mapOf("token" to simpleJWT.sign(user.name)))
            }
            route("/snippets") {
                get {
                    call.respond(mapOf("snippets" to synchronized(snippets) { snippets.toList() }))
                }
                authenticate {
                    post {
                        val post = call.receive<PostSnippet>()
                        val principal = call.principal<UserIdPrincipal>() ?: error("No principal")
                        snippets += Snippet(principal.name, post.snippet.text)
                        call.respond(mapOf("OK" to true))
                    }
                }
            }
        }
    }
    server.start(wait = true)
}