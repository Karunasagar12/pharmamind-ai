const API_BASE_URL = 'https://pharmamind-api-713737165318.us-central1.run.app/api'

export interface VisionQCStatus {
  system_active: boolean
  camera_available: boolean
  model_loaded: boolean
  processing_speed: string
  supported_objects: string[]
  timestamp: string
}

export interface DetectionResult {
  id: string
  label: string
  confidence: number
  bbox: [number, number, number, number]
  quality: 'excellent' | 'good' | 'warning' | 'defective'
  defects: string[]
  dimensions: {
    width: number
    height: number
    aspect_ratio: number
  }
  timestamp: string
}

export interface QualityMetrics {
  overall_score: number
  dimensional_accuracy: number
  surface_quality: number
  structural_integrity: number
  defect_count: number
}

export interface AnalysisResult {
  detection: DetectionResult
  all_detections?: DetectionResult[]
  quality_metrics: QualityMetrics
  recommendations: string[]
  processing_time: number
  ml_model?: string
  model_version?: string
  timestamp: string
}

export interface AnalysisHistory {
  id: string
  timestamp: string
  object_type: string
  quality: string
  confidence: number
  defect_count: number
  processing_time: number
}

export interface VisionQCHistory {
  history: AnalysisHistory[]
  total_analyses: number
  success_rate: number
  timestamp: string
}

class VisionQCApi {
  async getStatus(): Promise<VisionQCStatus> {
    const response = await fetch(`${API_BASE_URL}/visionqc/status`)
    if (!response.ok) {
      throw new Error('Failed to fetch VisionQC status')
    }
    return response.json()
  }

  async analyzeImage(imageFile?: File): Promise<AnalysisResult> {
    const formData = new FormData()
    if (imageFile) {
      formData.append('file', imageFile)
    }
    
    const response = await fetch(`${API_BASE_URL}/visionqc/analyze`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to analyze image')
    }
    
    return response.json()
  }

  async getHistory(): Promise<VisionQCHistory> {
    const response = await fetch(`${API_BASE_URL}/visionqc/history`)
    if (!response.ok) {
      throw new Error('Failed to fetch VisionQC history')
    }
    return response.json()
  }
}

export const visionqcApi = new VisionQCApi()
