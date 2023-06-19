export interface GeoData {
  places: Place[]
  all_types: string[]
}export interface Place {
  id: string
  type: string
  name: string
  dep: string
  address: string
  city: string
  conventioned: boolean
  welcome_desk: boolean
  food_space: boolean
  internal_food: boolean
  public_transport: boolean
  parking: number
  longitude: number
  latitude: number
  visible: boolean
  rooms: Room[]
  public_transport_comment?: string
}

export interface Room {
  id: number
  place: string
  type: string
  name: string
  place_name: string
  capacity?: number
  mobile_class: boolean
  computer: boolean
  computer_info?: string
  wifi: boolean
  projection: boolean
  visio: boolean
  disabled: boolean
  exp: boolean
  visible: boolean
  book?: string
}
