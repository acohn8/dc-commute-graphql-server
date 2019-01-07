export const typeDef = `
  type MapboxPlaceSearch {
    type: String
    query: [String]
    features: [MapboxFeature]
  }

  type MapboxFeature {
    id: String
    type: String
    place_type: [String]
    relevance: Int
    text: String
    place_name: String
    matching_place_name: String
    center: [Float]
    geometry: MapboxGeometry
    address: String
    context: [MapboxContext]
  }

  type MapboxGeometry {
    type: String
    coordinates: [Float]
  }

  type MapboxContext {
    id: String
    short_code: String
    wikidata: String
    text: String
  }
`;
