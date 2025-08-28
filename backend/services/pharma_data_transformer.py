"""
PharmaMind AI - Pharmaceutical Data Transformer
Transforms cholesterol drug manufacturing data into Spruik Libre format
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any

class PharmaDataTransformer:
    def __init__(self):
        self.process_data = None
        self.laboratory_data = None
        self.normalization_data = None
        self.time_series_data = {}
        
    def load_pharmaceutical_data(self):
        """Load all pharmaceutical manufacturing data"""
        print("Loading pharmaceutical manufacturing data...")
        
        # Load main manufacturing data
        self.process_data = pd.read_csv('data/raw/Process.csv')
        self.laboratory_data = pd.read_csv('data/raw/Laboratory.csv')
        self.normalization_data = pd.read_csv('data/raw/Normalization.csv')
        
        print(f"✓ Process.csv: {self.process_data.shape[0]} batches loaded")
        print(f"✓ Laboratory.csv: {self.laboratory_data.shape[0]} quality records loaded")
        print(f"✓ Normalization.csv: {self.normalization_data.shape[0]} normalization factors loaded")
        
        # Load time-series data for real-time simulation
        self._load_time_series_data()
        
    def _load_time_series_data(self):
        """Load individual time-series CSV files for real-time simulation"""
        print("Loading time-series data for real-time simulation...")
        
        # Load a few key time-series files for demonstration
        time_series_files = ['1.csv', '2.csv', '3.csv', '4.csv', '5.csv']
        
        for file_name in time_series_files:
            try:
                file_path = f'data/raw/Process/{file_name}'
                data = pd.read_csv(file_path)
                self.time_series_data[file_name] = data
                print(f"✓ {file_name}: {data.shape[0]} time points loaded")
            except Exception as e:
                print(f"⚠ Could not load {file_name}: {e}")
                
    def transform_batch_to_spruik_format(self, batch_id: int) -> Dict[str, Any]:
        """
        Transform a single cholesterol drug batch into Spruik Libre format
        
        Maps pharmaceutical parameters to manufacturing metrics:
        - tbl_speed_mean → planned_production, actual_production
        - main_CompForce_mean → compression_force
        - tbl_fill_mean → fill_weight
        - Drug release average (%) → quality_score
        - total_waste → waste_rate
        """
        
        if batch_id >= len(self.process_data):
            raise ValueError(f"Batch ID {batch_id} not found in data")
            
        batch = self.process_data.iloc[batch_id]
        lab_batch = self.laboratory_data.iloc[batch_id]
        
        # Get normalization factor for this product
        product_code = batch.get('Product', 1)  # Default to product 1
        norm_factor = self._get_normalization_factor(product_code)
        
        # Transform pharmaceutical data to Spruik format
        spruik_batch = {
            # Production metrics
            'planned_production': batch.get('tbl_speed_mean', 0) * norm_factor,
            'actual_production': batch.get('tbl_speed_mean', 0) * norm_factor * 0.95,  # 95% efficiency
            'current_rate': batch.get('tbl_speed_mean', 0),  # tablets/minute
            
            # Quality metrics
            'quality_score': 100 - (batch.get('total_waste', 0) / norm_factor),
            'drug_release_rate': batch.get('Drug release average (%)', 0),
            'dissolution_rate': lab_batch.get('dissolution_av', 0),
            'impurities': lab_batch.get('impurities_total', 0),
            'api_content': lab_batch.get('api_content', 0),
            
            # Manufacturing parameters
            'compression_force': batch.get('main_CompForce_mean', 0),  # kN
            'fill_weight': batch.get('tbl_fill_mean', 0),  # mg
            'ejection_force': batch.get('ejection_mean', 0),
            'stiffness': batch.get('stiffness_mean', 0),
            
            # Time metrics
            'running_time': self._calculate_running_time(batch_id),
            'held_time': batch.get('total_waste', 0) * 0.1,  # Estimate held time from waste
            
            # Availability and Performance (OEE components)
            'availability': self._calculate_availability(batch_id),
            'performance': self._calculate_performance(batch_id),
            'quality_oee': self._calculate_quality_oee(batch_id),
            
            # Metadata
            'batch_id': batch_id,
            'product_code': product_code,
            'timestamp': datetime.now().isoformat(),
            'pharmaceutical_grade': 'USP'  # United States Pharmacopeia standard
        }
        
        return spruik_batch
    
    def _get_normalization_factor(self, product_code: int) -> float:
        """Get normalization factor for cross-product comparison"""
        try:
            norm_row = self.normalization_data[self.normalization_data['Product'] == product_code]
            if not norm_row.empty:
                return norm_row.iloc[0].get('Normalization_Factor', 1.0)
        except:
            pass
        return 1.0  # Default normalization factor
    
    def _calculate_running_time(self, batch_id: int) -> float:
        """Calculate running time from time-series data"""
        # For now, return a simulated running time
        # In real implementation, this would be calculated from time-series data
        return 3600  # 1 hour in seconds
    
    def _calculate_availability(self, batch_id: int) -> float:
        """Calculate availability percentage"""
        batch = self.process_data.iloc[batch_id]
        waste_rate = batch.get('total_waste', 0)
        return max(0, 100 - (waste_rate * 0.5))  # Simplified calculation
    
    def _calculate_performance(self, batch_id: int) -> float:
        """Calculate performance percentage"""
        batch = self.process_data.iloc[batch_id]
        target_speed = 100  # Target tablets per minute
        actual_speed = batch.get('tbl_speed_mean', 0)
        return min(100, (actual_speed / target_speed) * 100)
    
    def _calculate_quality_oee(self, batch_id: int) -> float:
        """Calculate quality component of OEE"""
        batch = self.process_data.iloc[batch_id]
        lab_batch = self.laboratory_data.iloc[batch_id]
        
        # Quality factors
        drug_release = batch.get('Drug release average (%)', 0) / 100
        dissolution = lab_batch.get('dissolution_av', 0) / 100
        impurities = max(0, 1 - (lab_batch.get('impurities_total', 0) / 100))
        
        # Weighted quality score
        quality_score = (drug_release * 0.4 + dissolution * 0.4 + impurities * 0.2) * 100
        return quality_score
    
    def generate_realtime_simulation_data(self, batch_id: int) -> Dict[str, Any]:
        """Generate real-time simulation data for dashboard display"""
        
        batch = self.transform_batch_to_spruik_format(batch_id)
        
        # Add real-time simulation components
        simulation_data = {
            **batch,
            'simulation_mode': True,
            'current_status': 'running',  # running, stopped, held, complete
            'line_status': {
                'idle': 0,
                'stopped': 0,
                'held': 0,
                'execute': 1,  # Currently executing
                'complete': 0
            },
            'real_time_metrics': {
                'tablets_produced': batch['actual_production'],
                'compression_force_current': batch['compression_force'],
                'fill_weight_current': batch['fill_weight'],
                'quality_alert': batch['quality_score'] < 95
            }
        }
        
        return simulation_data
    
    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Get summary statistics for dashboard overview"""
        
        if self.process_data is None:
            return {}
            
        summary = {
            'total_batches': len(self.process_data),
            'total_products': self.process_data['Product'].nunique() if 'Product' in self.process_data.columns else 1,
            'average_quality_score': self.process_data.get('Drug release average (%)', pd.Series([0])).mean(),
            'average_production_rate': self.process_data.get('tbl_speed_mean', pd.Series([0])).mean(),
            'total_waste_rate': self.process_data.get('total_waste', pd.Series([0])).mean(),
            'pharmaceutical_metrics': {
                'avg_dissolution': self.laboratory_data.get('dissolution_av', pd.Series([0])).mean() if self.laboratory_data is not None else 0,
                'avg_impurities': self.laboratory_data.get('impurities_total', pd.Series([0])).mean() if self.laboratory_data is not None else 0,
                'avg_api_content': self.laboratory_data.get('api_content', pd.Series([0])).mean() if self.laboratory_data is not None else 0
            }
        }
        
        return summary

# Example usage
if __name__ == "__main__":
    transformer = PharmaDataTransformer()
    transformer.load_pharmaceutical_data()
    
    # Transform first batch
    batch_0 = transformer.transform_batch_to_spruik_format(0)
    print("\n=== Transformed Pharmaceutical Data ===")
    print(json.dumps(batch_0, indent=2))
    
    # Get dashboard summary
    summary = transformer.get_dashboard_summary()
    print("\n=== Dashboard Summary ===")
    print(json.dumps(summary, indent=2))
