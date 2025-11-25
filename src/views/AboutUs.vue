<!-- Importacion de Imagenes -->
  <script setup>
    import historia from '@/assets/about/historia.png'
    import mision from '@/assets/about/mision.png'
    import vision from '@/assets/about/vision.png'
    import equipo from '@/assets/about/equipo.png'
  </script>

  
<template>
  <div class="about-us">
    <div class="container">

      <!-- Encabezado -->
      <div class="page-header">
        <h1>Sobre Nosotros</h1>
        <p>Conoce la historia, misión y funciones del Ministerio de Medio Ambiente y Recursos Naturales.</p>
      </div>

      <div class="content-grid">

        <!-- Historia -->
        <div class="history-section">
          <h2>Nuestra Historia</h2>

         <img :src="historia" class="section-image" alt="Historia" />

          <p>
            El Ministerio de Medio Ambiente y Recursos Naturales fue creado mediante la Ley 64-00,
            promulgada el 18 de agosto del año 2000, con el fin de regular y proteger los recursos
            naturales del país y garantizar una gestión ambiental responsable.
          </p>

          <p>
            Desde entonces, la institución ha desarrollado políticas públicas orientadas a la
            conservación, la educación ambiental, la fiscalización de actividades económicas y el
            cumplimiento de compromisos internacionales frente al cambio climático.
          </p>

          <div class="milestones">
            <div class="milestone">
              <h3>2000</h3>
              <p>Creación del Ministerio mediante la Ley General de Medio Ambiente.</p>
            </div>
            <div class="milestone">
              <h3>2012</h3>
              <p>Integración del Ministerio a la Estrategia Nacional de Desarrollo 2030.</p>
            </div>
            <div class="milestone">
              <h3>2023</h3>
              <p>Fortalecimiento de programas de conservación y gestión de áreas protegidas.</p>
            </div>
          </div>
        </div>

        <!-- Misión / Visión -->
        <div class="mission-vision">

          <div class="mission">
            <h2>Misión</h2>

         <img :src="mision" class="section-image" alt="Misión" />


            <p>
              Proteger y administrar los recursos naturales del país mediante políticas eficaces,
              educación ambiental, fiscalización y gestión sostenible, garantizando el bienestar de
              la población y la integridad ecológica.
            </p>
          </div>

          <div class="vision">
            <h2>Visión</h2>

         <img :src="vision" class="section-image" alt="Visión" />
            

            <p>
              Ser una institución moderna, transparente y líder en la gestión ambiental, reconocida
              por promover una cultura nacional de sostenibilidad y respeto por los recursos naturales.
            </p>
          </div>

          <div class="functions">
            <h2>Funciones Principales</h2>

         <img :src="equipo" class="section-image" alt="Equipo" />


            <ul>
              <li>Formular y supervisar políticas ambientales.</li>
              <li>Regular el uso y explotación de los recursos naturales.</li>
              <li>Administrar el Sistema Nacional de Áreas Protegidas.</li>
              <li>Emitir permisos y licencias ambientales.</li>
              <li>Promover educación ambiental a nivel nacional.</li>
              <li>Coordinar acciones contra el cambio climático.</li>
            </ul>
          </div>
        </div>


        <!-- Video -->
        <div class="video-section">
            <h2>Conoce Nuestro Trabajo</h2>

                <iframe
                  src="https://drive.google.com/file/d/1jNbMKYIRDCDPOOV5Fi3Per5uXzJjunOQ/view?usp=sharing"
                  width="100%"
                  height="350"
                  allow="autoplay"
                ></iframe>

          </div>
        </div>
      </div>
    </div>
</template>
