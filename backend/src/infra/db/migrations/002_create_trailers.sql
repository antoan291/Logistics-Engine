-- Trailers table
CREATE TABLE trailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'box', 'curtain', 'reefer', etc.
  
  -- Internal dimensions (meters)
  length DECIMAL(5,2) NOT NULL CHECK (length > 0),
  width DECIMAL(5,2) NOT NULL CHECK (width > 0),
  height DECIMAL(5,2) NOT NULL CHECK (height > 0),
  
  -- Volume (cubic meters)
  trailer_cubes DECIMAL(10,2) NOT NULL CHECK (trailer_cubes > 0),
  
  -- Weight limits (kg)
  max_weight DECIMAL(10,2) NOT NULL CHECK (max_weight > 0),
  max_axle_weight_front DECIMAL(10,2) NOT NULL CHECK (max_axle_weight_front > 0),
  max_axle_weight_rear DECIMAL(10,2) NOT NULL CHECK (max_axle_weight_rear > 0),
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_trailers_type ON trailers(type);
CREATE INDEX idx_trailers_created_by ON trailers(created_by);
CREATE INDEX idx_trailers_is_active ON trailers(is_active);