export interface Trailer {
  id: string;
  name: string;
  type: string;

  //dimension(meters)
  length: number;
  width: number;
  height: number;

  //Volume(cubic meters)
  trailer_cubes: number;

  //Weight limis(kg)
  max_load_weight: number;
  max_axle_weight_front: number;
  max_axle_weight_rear: number;

  //Metadata
  created_by: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface CreateTrailerInput {
  name: string;
  type: string;
  length: number;
  width: number;
  height: number;
  trailerCubes: number;
  maxWeight: number;
  maxAxleWeightFront: number;
  maxAxleWeightRear: number;
}

export interface UpdateTrailerInput {
  name?: string;
  type?: string;
  length?: number;
  width?: number;
  height?: number;
  trailerCubes?: number;
  maxWeight?: number;
  maxAxleWeightFront?: number;
  maxAxleWeightRear?: number;
  is_active?: boolean;
}
