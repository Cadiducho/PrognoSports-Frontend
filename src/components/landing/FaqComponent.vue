<template>
    <div class="container mt-6 mb-6">
        <h1 class="title">Preguntas Frecuentes</h1>
        <section class="content">
            <strong>¿Qué es PrognoSports?</strong>
            <p>PrognoSports es una plataforma para realizar pronósticos deportivos en una comunidad de amigos y competir para obtener mejores resultados que el resto</p>
        </section>
        <section class="content">
            <strong>¿Es PrognoSports de pago?</strong>
            <p>No, PrognoSports es gratuíto y se financia gracias a donaciones de usuarios. Puedes leer más en nuestros  <router-link :to="{name: 'terms'}">Términos y Condiciones</router-link>.</p>
        </section>
        <section class="content">
            <strong>¿Es PrognoSports una platforma de apuestas o juego online?</strong>
            <p>No, en PrognoSports no hay apuestas (ni monetarias, ni de puntos, ni de ningún tipo). Simplemente pronosticas unos resultados y se te recompensa con unos puntos en función de tus aciertos y las normas de la comunidad en la que estés participando. Puedes leer más en nuestros  <router-link :to="{name: 'terms'}">Términos y Condiciones</router-link>.</p>
        </section>
        <section class="content">
            <strong>¿Qué es una comunidad?</strong>
            <p>Entendemos por comunidad la asociación o liga que reúne una serie de usuarios para competir entre ellos. Puedes participar en varias comunidades a la vez, y cada comunidad estará ligada a una competición deportiva en concreto. </p>
        </section>
        <section class="content">
            <strong>¿Puedo crear comunidades?</strong>
            <p>Sí, podrás crearlas y decidir si están abiertas o cerradas. De esta manera, podrás permitir que entre cualquier otro usuario, o sólo aquellos con los que compartas el enlace de invitación. Al crear una comunidad, podrás decidir el sistema de puntuación que usar.</p>
        </section>
        <section class="content">
            <strong>¿Puedo esconder mis pronósticos?</strong>
            <p>Sí, si te preocupa que otros usuarios te copien, puedes esconder tus pronósticos. Ojo, estos se harán públicos en el momento en el que pase la hora de cierre del pronóstico y ya no se puedan modificar.</p>
        </section>
        <section class="content">
            <strong>¿Qué es eso de "cierre de pronósticos"?</strong>
            <p>La hora límite hasta la que podrás pronosticar. A partir de ahí, ya no podrás cambiar o realizar tus pronósticos. Por ejemplo, si una carrera comienza a las 14:00, es habitual que el límite esté antes del comienzo, a las 13:55. Esta hora límite dependerá de cada comunidad.</p>
        </section>
        <section class="content">
            <strong>¿Cómo se cuentan los resultados?</strong>
            <p>Por lo general, se tomarán los resultados oficiales de la competición. No obstante, cada competición dentro de PrognoSports tiene sus normas y podrá modificar esos resultados si así lo estipulan las normas.</p>
        </section>
        <section class="content">
            <strong>¿Cuánto tardan en otorgarse puntos?</strong>
            <p>Los puntos se otorgan una vez son guardados los resultados en nuestros sistemas. Este tiempo es variable, pueden ser unos momentos desde el final del evento, o quizás unas horas. Si quieres enterarte de cuándo se han repartido los puntos, puedes activar tus notificaciones.</p>
        </section>
        <section class="content">
            <strong>¿Puedo personalizar mis notificaciones?</strong>
            <p>Sí, en tus ajustes de perfil podrás decidir qué notificaciones recibir, y a través de qué medios.</p>
        </section>
        <section class="content">
            <strong>¿Qué más puedo personalizar?</strong>
            <p>En tus ajustes de perfil podrás cambiar la zona horaria, si mostrar nombres largos o cortos de equipos y otros datos personales como tu localización, cumpleaños, biografía o foto de perfil. Sobre la gestión de estos últimos datos, revisa <router-link :to="{name: 'privacy'}">Políticas de Privacidad</router-link>.</p>
        </section>
    </div>
</template>