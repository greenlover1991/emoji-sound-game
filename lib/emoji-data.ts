export interface EmojiItem {
  emoji: string
  name: string
  soundUrl?: string // Wikimedia Commons audio URL
}

export interface Category {
  id: string
  name: string
  emoji: string
  color: string
  items: EmojiItem[]
}

// Audio files from Wikimedia Commons (freely licensed)
// Using direct .ogg URLs which have broad browser support
export const categories: Category[] = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    emoji: '🚗',
    color: 'bg-vehicles',
    items: [
      { emoji: '🚗', name: 'Car', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Indy_car_passes.ogg' },
      { emoji: '🚌', name: 'Bus', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Bus_RATP_moteur_Renault_VI.ogg' },
      { emoji: '🚒', name: 'Fire Truck', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Fire_engine_siren.ogg' },
      { emoji: '🚑', name: 'Ambulance', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Ambulance_Siren.ogg' },
      { emoji: '🚓', name: 'Police Car', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/American_police_siren_i.ogg' },
      { emoji: '🚂', name: 'Train', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Taurus_anfahrgeraeusch.ogg' },
      { emoji: '✈️', name: 'Airplane', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Jet_landing.ogg' },
      { emoji: '🚁', name: 'Helicopter', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Chinook_helicopter_flying_over_Greenwich_in_London.ogg' },
      { emoji: '🛳️', name: 'Ship', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/East_Brother_Light_Diaphone_Foghorn.oga' },
      { emoji: '🚲', name: 'Bicycle', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bicycle-bell-1.wav' },
      { emoji: '🏍️', name: 'Motorcycle', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Hells_Canyon_Motorcycle_Rally%2C_1989_%28audio%29.ogg' },
      { emoji: '🚚', name: 'Truck', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Kamaz_dakar.ogg' },
    ]
  },
  {
    id: 'instruments',
    name: 'Instruments',
    emoji: '🎸',
    color: 'bg-instruments',
    items: [
      { emoji: '🎹', name: 'Piano', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Piano.ogg' },
      { emoji: '🎸', name: 'Guitar', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Guitarra_ac%C3%BAstica.ogg' },
      { emoji: '🎺', name: 'Trumpet', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Trumpet_playing_short_excerpt_for_comparison_with_flugelhorn.ogg' },
      { emoji: '🎷', name: 'Saxophone', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/1_42_Tenor_Saxophone_Scale.ogg' },
      { emoji: '🎻', name: 'Violin', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Violin_sounds_and_techniques.ogg' },
      { emoji: '🥁', name: 'Drum', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Drum.ogg' },
      { emoji: '🪘', name: 'Bongo', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Djembe_bass%2C_tone%2C_tonpalo%2C_slap.ogg' },
      { emoji: '🪗', name: 'Accordion', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Accordion_chords-01.ogg' },
      { emoji: '🔔', name: 'Bell', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Glocken_der_Alexanderkirche_Wildeshausen.ogg' },
      { emoji: '🪈', name: 'Flute', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Flute_chromatic_scale.ogg' },
      { emoji: '🪕', name: 'Banjo', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Banjo64.ogg' },
      { emoji: '🎵', name: 'Xylophone', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Xylophone_scale.ogg' },
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐶',
    color: 'bg-animals',
    items: [
      { emoji: '🐶', name: 'Dog', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Barking_of_a_dog_2.ogg' },
      { emoji: '🐱', name: 'Cat', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Meow.ogg' },
      { emoji: '🐄', name: 'Cow', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Cow-moo.ogg' },
      { emoji: '🐷', name: 'Pig', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Pig_oink.ogg' },
      { emoji: '🐔', name: 'Rooster', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Rooster_crowing.oga' },
      { emoji: '🐸', name: 'Frog', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Single_Frog_Croak.oga' },
      { emoji: '🦁', name: 'Lion', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Lionroar.ogg' },
      { emoji: '🐘', name: 'Elephant', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Elephant_trumpet.ogg' },
      { emoji: '🐴', name: 'Horse', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Wiehern.ogg' },
      { emoji: '🐑', name: 'Sheep', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Ovis_orientalis_aries_-_bleat.ogg' },
      { emoji: '🦆', name: 'Duck', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Quacks.ogg' },
      { emoji: '🐦', name: 'Bird', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Bird_singing.ogg' },
      { emoji: '🦉', name: 'Owl', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Strix_aluco_2.ogg' },
      { emoji: '🐝', name: 'Bee', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Bees_Ede_NL.ogg' },
      { emoji: '🐺', name: 'Wolf', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Howlsnow.ogg' },
      { emoji: '🐵', name: 'Monkey', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Howler_monkey.ogg' },
      { emoji: '🦜', name: 'Parrot', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Melopsittacus_undulatus_-_song.ogg' },
      { emoji: '🦃', name: 'Turkey', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Wild_turkey_call.ogg' },
      { emoji: '🐐', name: 'Goat', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Capra_aegagrus_hircus_-_scream.ogg' },
      { emoji: '🦅', name: 'Eagle', soundUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Haliaeetus_leucocephalus_-_Bird_Call.ogg' },
    ]
  }
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id)
}
