import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProtectedArea } from '@/types';
import { storage } from '@/utils';

// Importar todas las imágenes desde src/assets
import losHaitisesImg from '@/assets/areas/los-haitises.png';
import ebanoVerdeImg from '@/assets/areas/ebano-verde.png';
import jaraguaImg from '@/assets/areas/jaragua.png';
import bermudezImg from '@/assets/areas/bermudez.png';
import parqueEsteImg from '@/assets/areas/parque-este.png';
import damajaguaImg from '@/assets/areas/damajagua.png';
import cuevasBorbonImg from '@/assets/areas/cuevas-boborn.png';
import parqueCaletaImg from '@/assets/areas/parque-caleta.png';
import manglaresYunaImg from '@/assets/areas/manglares-yuna.png';
import bahorucoImg from '@/assets/areas/bahoruco.png';


export const useAreasStore = defineStore('areas', () => {
  // State - Cargar desde localStorage o usar datos por defecto
  const areas = ref<ProtectedArea[]>(
    storage.get('protected_areas') || getDefaultAreas()
  );

  // Getters
  const areaCount = computed(() => areas.value.length);
  const parkCount = computed(() => 
    areas.value.filter(a => a.tipo.includes('Parque Nacional')).length
  );
  const reserveCount = computed(() =>
    areas.value.filter(a => a.tipo.includes('Reserva')).length
  );
  const monumentCount = computed(() =>
    areas.value.filter(a => a.tipo.includes('Monumento')).length
  );

  // Actions
  const addArea = (area: Omit<ProtectedArea, 'id'>) => {
    const newArea: ProtectedArea = {
      ...area,
      id: generateId()
    };
    
    areas.value.unshift(newArea);
    saveToStorage();
    return newArea;
  };

  const updateArea = (id: number, updates: Partial<ProtectedArea>) => {
    const index = areas.value.findIndex(a => a.id === id);
    if (index !== -1) {
      areas.value[index] = { ...areas.value[index], ...updates };
      saveToStorage();
    }
  };

  const deleteArea = (id: number) => {
    const index = areas.value.findIndex(a => a.id === id);
    if (index !== -1) {
      areas.value.splice(index, 1);
      saveToStorage();
    }
  };

  const getAreaById = (id: number) => {
    return areas.value.find(a => a.id === id);
  };

  // Guardar en localStorage
  const saveToStorage = () => {
    storage.set('protected_areas', areas.value);
  };

  // Generar ID único
  const generateId = (): number => {
    const maxId = areas.value.reduce((max, area) => 
      Math.max(max, area.id), 0
    );
    return maxId + 1;
  };

  // Datos por defecto (tus 10 áreas)
  function getDefaultAreas(): ProtectedArea[] {
    return [
     {
        id: 1,
        nombre: 'Parque Nacional Los Haitises',
        descripcion: 'Una de las áreas protegidas más importantes y biodiversas de República Dominicana, caracterizada por sus impresionantes mogotes (colinas cársticas), densos bosques de manglares y numerosas cuevas con pictografías taínas. Este parque alberga más de 700 especies de plantas, incluyendo orquídeas endémicas, y es hogar de especies emblemáticas como el solenodón y la jutía. Sus bahías y cayos constituyen un ecosistema único en el Caribe que sirve como refugio para aves migratorias y residentes.',
        latitud: 19.0333,
        longitud: -69.5833,
        imagen: losHaitisesImg, // ← USANDO IMPORT
        ubicacion: 'Región Nordeste',
        extension: '1,600 km²',
        tipo: 'Parque Nacional',
        flora: ['Caoba', 'Ceiba', 'Helechos arborescentes', 'Orquídeas endémicas', 'Mangles rojos'],
        fauna: ['Solendón', 'Jutía', 'Manatí antillano', 'Peregrino', 'Cotorra de La Hispaniola'],
        actividades: ['Observación de aves', 'Paseos en bote', 'Senderismo', 'Exploración de cuevas'],
        clima: 'Tropical húmedo',
        horario: '8:00 AM - 5:00 PM',
        contacto: '(809) 555-0123'
      },
      {
        id: 2,
        nombre: 'Reserva Científica Ébano Verde',
        descripcion: 'Situada en la Cordillera Central, esta reserva protege una de las últimas poblaciones del ébano verde, árbol endémico en peligro de extinción. El bosque nublado presenta una biodiversidad excepcional con numerosas especies de orquídeas, bromelias y helechos. La reserva funciona como una esponja natural que captura la humedad de las nubes, alimentando importantes ríos como el Camú y el Yaque del Norte. Su ecosistema es vital para la investigación científica y la conservación de especies únicas de la isla.',
        latitud: 19.1167,
        longitud: -70.5333,
        imagen: ebanoVerdeImg, // ← USANDO IMPORT
        ubicacion: 'Cordillera Central',
        extension: '290 km²',
        tipo: 'Reserva Científica',
        flora: ['Ébano verde', 'Pinos criollos', 'Orquídeas endémicas', 'Bromelias', 'Helechos arborescentes'],
        fauna: ['Cotorra de La Hispaniola', 'Carpintero de sierra', 'Anfibios endémicos', 'Mariposas unique'],
        actividades: ['Investigación científica', 'Senderismo especializado', 'Observación de flora'],
        clima: 'Templado de montaña',
        horario: 'Solo con permiso especial',
        contacto: '(809) 555-0124'
      },
      {
        id: 3,
        nombre: 'Parque Nacional Jaragua',
        descripcion: 'Considerado el parque nacional más grande del Caribe, Jaragua abarca ecosistemas terrestres y marinos de extraordinaria importancia. Incluye la laguna de Oviedo, con su población de flamencos rosados, playas de anidación de tortugas marinas y la isla Beata con sus formaciones coralinas. El parque protege importantes sitios arqueológicos taínos y presenta una vegetación adaptada a condiciones semiáridas, incluyendo cactus gigantes y bosques secos. Sus aguas cristalinas albergan arrecifes de coral entre los más saludables del Caribe.',
        latitud: 17.8000,
        longitud: -71.2833,
        imagen: jaraguaImg, // ← USANDO IMPORT
        ubicacion: 'Península de Barahona',
        extension: '1,374 km²',
        tipo: 'Parque Nacional',
        flora: ['Cactus gigante', 'Guayacán', 'Bayahonda', 'Orquídeas del desierto'],
        fauna: ['Flamenco rosado', 'Tortugas marinas', 'Iguanas rinoceronte', 'Manatíes'],
        actividades: ['Observación de flamencos', 'Buceo', 'Snorkeling', 'Avistamiento de tortugas'],
        clima: 'Semiárido',
        horario: '7:00 AM - 6:00 PM',
        contacto: '(809) 555-0125'
      },
      {
        id: 4,
        nombre: 'Parque Nacional Armando Bermúdez',
        descripcion: 'Ubicado en el corazón de la Cordillera Central, este parque protege las cuencas altas de los principales ríos del país y alberga el Pico Duarte, la montaña más alta del Caribe. Sus bosques de pinos criollos y latifoliados presentan una biodiversidad única con especies adaptadas a las altas elevaciones. El parque es fundamental para la regulación hídrica del país y ofrece espectaculares paisajes de montaña, cascadas y valles profundos. Durante el invierno, las temperaturas pueden descender bajo cero en las cumbres más altas.',
        latitud: 19.0333,
        longitud: -70.9833,
        imagen: bermudezImg, // ← USANDO IMPORT
        ubicacion: 'Cordillera Central',
        extension: '766 km²',
        tipo: 'Parque Nacional',
        flora: ['Pino criollo', 'Sabina', 'Palma de montaña', 'Helechos', 'Líquenes'],
        fauna: ['Cotorra de La Hispaniola', 'Carpintero', 'Jilguero', 'Anfibios endémicos'],
        actividades: ['Escalada de montañas', 'Senderismo', 'Camping', 'Observación de aves'],
        clima: 'Alpino tropical',
        horario: '6:00 AM - 5:00 PM',
        contacto: '(809) 555-0126'
      },
      {
        id: 5,
        nombre: 'Parque Nacional del Este',
        descripcion: 'Este importante parque costero-marino protege ecosistemas únicos que incluyen bosques secos, playas de anidación de tortugas, arrecifes de coral y la famosa Isla Saona. El parque alberga importantes poblaciones de aves marinas y terrestres, así como sitios arqueológicos taínos de gran valor cultural. Sus aguas cristalinas son hogar de delfines, manatíes y numerosas especies de peces tropicales. La variedad de ecosistemas presentes lo convierte en un laboratorio natural para el estudio de la biodiversidad caribeña.',
        latitud: 18.3000,
        longitud: -68.7000,
        imagen: parqueEsteImg, // ← USANDO IMPORT
        ubicacion: 'Sureste',
        extension: '430 km²',
        tipo: 'Parque Nacional',
        flora: ['Uva de playa', 'Cactus', 'Mangle botón', 'Orquídeas silvestres'],
        fauna: ['Tortugas marinas', 'Delfines', 'Manatíes', 'Fragatas', 'Pelícanos'],
        actividades: ['Snorkeling', 'Observación de tortugas', 'Visita a Isla Saona', 'Tour arqueológico'],
        clima: 'Tropical seco',
        horario: '8:00 AM - 5:00 PM',
        contacto: '(809) 555-0127'
      },
      {
        id: 6,
        nombre: 'Monumento Natural Saltos de la Damajagua',
        descripcion: 'Famoso por sus 27 cascadas y pozos de agua cristalina, este monumento natural ofrece una experiencia única de ecoturismo en medio de un bosque tropical húmedo. Los visitantes pueden escalar, saltar y deslizarse por las cascadas mientras admiran la exuberante vegetación y la fauna local. El sistema fluvial forma piscinas naturales de aguas turquesas rodeadas de rocas calizas erosionadas. Este ecosistema es vital para la recarga acuífera y la conservación de especies endémicas de anfibios e insectos.',
        latitud: 19.6167,
        longitud: -70.9833,
        imagen: damajaguaImg, // ← USANDO IMPORT
        ubicacion: 'Puerto Plata',
        extension: '4.5 km²',
        tipo: 'Monumento Natural',
        flora: ['Helechos gigantes', 'Bromelias', 'Orquídeas de río', 'Árboles de sombra'],
        fauna: ['Cangrejos de río', 'Anfibios endémicos', 'Mariposas', 'Aves ribereñas'],
        actividades: ['Salto de cascadas', 'Natación', 'Senderismo acuático', 'Fotografía'],
        clima: 'Tropical húmedo',
        horario: '8:30 AM - 4:00 PM',
        contacto: '(809) 555-0128'
      },
      {
        id: 7,
        nombre: 'Reserva Antropológica Cuevas de Borbón',
        descripcion: 'Este sistema de cuevas conserva uno de los conjuntos más importantes de arte rupestre taíno en el Caribe, con pictografías y petroglifos que datan de hace más de 1,000 años. Las cuevas también albergan formaciones geológicas espectaculares como estalactitas, estalagmitas y columnas. El área circundante protege un bosque seco con especies vegetales adaptadas a las condiciones kársticas. Este sitio es fundamental para entender la cultura precolombina y la relación de los taínos con su entorno natural.',
        latitud: 18.4833,
        longitud: -69.9167,
        imagen: cuevasBorbonImg, // ← USANDO IMPORT
        ubicacion: 'Santo Domingo',
        extension: '2.8 km²',
        tipo: 'Reserva Científica',
        flora: ['Árboles caducifolios', 'Cactus', 'Plantas rupícolas', 'Lianas'],
        fauna: ['Murciélagos', 'Arañas de cueva', 'Insectos trogloditas', 'Reptiles'],
        actividades: ['Tour arqueológico', 'Espeleología', 'Fotografía histórica', 'Estudios culturales'],
        clima: 'Tropical húmedo',
        horario: '9:00 AM - 4:00 PM',
        contacto: '(809) 555-0129'
      },
      {
        id: 8,
        nombre: 'Parque Nacional Submarino La Caleta',
        descripcion: 'Este parque nacional submarino es uno de los sitios de buceo más importantes del Caribe, protegiendo un ecosistema marino excepcional que incluye arrecifes de coral, praderas de pastos marinos y un pecio histórico. El parque alberga el famoso barco hundido "Hickory" que sirve como arrecife artificial, atraendo una gran diversidad de vida marina. Las aguas cristalinas permiten una visibilidad excepcional para observar morenas, tortugas marinas, rayas y numerosas especies de peces tropicales. Este santuario marino es vital para la reproducción de especies comerciales y la protección de la biodiversidad costera.',
        latitud: 18.4167,
        longitud: -69.6833,
        imagen: parqueCaletaImg, // ← USANDO IMPORT
        ubicacion: 'Costa Sur, cerca de Santo Domingo',
        extension: '10 km² marinos',
        tipo: 'Parque Nacional Submarino',
        flora: ['Corales cuernos de alce', 'Corales cerebro', 'Abanicos de mar', 'Pastos marinos', 'Algas coralinas'],
        fauna: ['Tortugas marinas', 'Morenas', 'Rayas águila', 'Pez ángel', 'Pez loro', 'Cangrejos ermitaños'],
        actividades: ['Buceo recreativo', 'Snorkeling', 'Fotografía submarina', 'Investigación marina', 'Educación ambiental'],
        clima: 'Tropical costero',
        horario: '8:00 AM - 5:00 PM',
        contacto: '(809) 555-0130'
      },
      {
        id: 9, // ← CORREGIDO: Cambiado de 8 a 9
        nombre: 'Parque Nacional Manglares del Bajo Yuna',
        descripcion: 'Este extenso sistema de manglares en la desembocadura del río Yuna constituye uno de los humedales más importantes del Caribe para la conservación de aves acuáticas y especies marino-costeras. Los manglares sirven como criadero natural para peces, crustáceos y moluscos, sustentando las pesquerías locales. El parque protege cuatro tipos de mangle y es un sitio crucial para aves migratorias neotropicales. Durante la temporada de migración, miles de aves utilizan este humedal como área de descanso y alimentación en su ruta entre Norte y Sur América.',
        latitud: 19.2000,
        longitud: -69.5667,
        imagen: manglaresYunaImg, // ← USANDO IMPORT
        ubicacion: 'Bahía de Samaná',
        extension: '110 km²',
        tipo: 'Parque Nacional',
        flora: ['Mangle rojo', 'Mangle negro', 'Mangle blanco', 'Mangle botón', 'Lianas mangleras'],
        fauna: ['Flamencos', 'Garzas', 'Pelícanos', 'Cocodrilos americanos', 'Manatíes', 'Cangrejos azules'],
        actividades: ['Paseos en bote', 'Observación de aves', 'Fotografía de naturaleza', 'Pesca deportiva regulada'],
        clima: 'Tropical húmedo',
        horario: '7:00 AM - 6:00 PM',
        contacto: '(809) 555-0130'
      },
      {
        id: 10,
        nombre: 'Parque Nacional Sierra de Bahoruco',
        descripcion: 'Esta sierra constituye un hotspot de biodiversidad con ecosistemas que van desde bosques secos a nivel del mar hasta bosques nublados en las alturas. El parque protege numerosas especies endémicas de plantas y animales, incluyendo orquídeas únicas y anfibios que no se encuentran en ningún otro lugar del mundo. La variación altitudinal crea microclimas distintos que albergan comunidades biológicas especializadas. La sierra también contiene importantes formaciones geológicas como el Hoyo de Pelempito, un impresionante valle intramontañoso.',
        latitud: 18.1667,
        longitud: -71.5833,
        imagen: bahorucoImg, // ← USANDO IMPORT
        ubicacion: 'Suroeste',
        extension: '1,100 km²',
        tipo: 'Parque Nacional',
        flora: ['Pinos endémicos', 'Orquídeas únicas', 'Helechos gigantes', 'Palmas de montaña'],
        fauna: ['Solendón', 'Jutía', 'Anfibios endémicos', 'Mariposas raras'],
        actividades: ['Senderismo especializado', 'Observación de orquídeas', 'Fotografía científica', 'Investigación'],
        clima: 'Variable según altitud',
        horario: '7:00 AM - 4:00 PM',
        contacto: '(809) 555-0132'
      }
    ];
  }

  return {
    // State
    areas,
    
    // Getters
    areaCount,
    parkCount,
    reserveCount,
    monumentCount,
    
    // Actions
    addArea,
    updateArea,
    deleteArea,
    getAreaById,
    saveToStorage
  };
});