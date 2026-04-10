import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import json

class StudentPerformancePredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.feature_columns = ['age', 'attendance_rate', 'study_hours', 'previous_gpa', 'parent_education', 'extracurricular']

    def load_sample_data(self):
        """Load sample student data for training"""
        # Sample data - in real implementation, this would come from your database
        data = {
            'age': [16, 17, 15, 18, 16, 17, 15, 16, 18, 17],
            'attendance_rate': [95, 88, 92, 85, 90, 87, 93, 89, 86, 91],
            'study_hours': [8, 6, 9, 5, 7, 6, 10, 7, 4, 8],
            'previous_gpa': [3.5, 2.8, 3.2, 2.5, 3.0, 2.9, 3.8, 3.1, 2.3, 3.4],
            'parent_education': ['Bachelor', 'High School', 'Master', 'High School', 'Bachelor', 'Associate', 'Master', 'Bachelor', 'High School', 'Master'],
            'extracurricular': ['Sports', 'None', 'Music', 'Sports', 'Arts', 'None', 'Sports', 'Music', 'None', 'Arts'],
            'final_grade': [85, 72, 88, 68, 78, 75, 92, 80, 65, 85]  # Target variable
        }
        return pd.DataFrame(data)

    def preprocess_data(self, df):
        """Preprocess the data for training"""
        # Encode categorical variables
        for col in ['parent_education', 'extracurricular']:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
            df[col] = self.label_encoders[col].fit_transform(df[col])

        return df

    def train_model(self):
        """Train the prediction model"""
        # Load and preprocess data
        df = self.load_sample_data()
        df = self.preprocess_data(df)

        # Split features and target
        X = df[self.feature_columns]
        y = df['final_grade']

        # Split into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train Random Forest model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)

        # Evaluate model
        y_pred = self.model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        print(f"Model trained successfully!")
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"R² Score: {r2:.2f}")

        # Save the model
        self.save_model()

        return {"mse": mse, "r2": r2}

    def predict_performance(self, student_data):
        """Predict student performance based on input data"""
        if self.model is None:
            self.load_model()

        # Convert input to DataFrame
        df = pd.DataFrame([student_data])

        # Preprocess
        for col in ['parent_education', 'extracurricular']:
            if col in df.columns and col in self.label_encoders:
                df[col] = self.label_encoders[col].transform(df[col])

        # Ensure all required columns are present
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0  # Default value

        X = df[self.feature_columns]

        # Make prediction
        prediction = self.model.predict(X)[0]

        return {
            "predicted_grade": round(prediction, 2),
            "performance_category": self.get_performance_category(prediction)
        }

    def get_performance_category(self, grade):
        """Categorize performance based on predicted grade"""
        if grade >= 90:
            return "Excellent"
        elif grade >= 80:
            return "Good"
        elif grade >= 70:
            return "Average"
        elif grade >= 60:
            return "Below Average"
        else:
            return "Needs Improvement"

    def save_model(self):
        """Save the trained model and encoders"""
        joblib.dump(self.model, 'student_performance_model.pkl')
        joblib.dump(self.label_encoders, 'label_encoders.pkl')
        print("Model saved successfully!")

    def load_model(self):
        """Load the trained model and encoders"""
        try:
            self.model = joblib.load('student_performance_model.pkl')
            self.label_encoders = joblib.load('label_encoders.pkl')
            print("Model loaded successfully!")
        except FileNotFoundError:
            print("Model not found. Please train the model first.")
            return False
        return True

def main():
    predictor = StudentPerformancePredictor()

    # Train the model
    print("Training the student performance prediction model...")
    metrics = predictor.train_model()
    print(f"Training completed. MSE: {metrics['mse']:.2f}, R²: {metrics['r2']:.2f}")

    # Example prediction
    sample_student = {
        "age": 16,
        "attendance_rate": 90,
        "study_hours": 7,
        "previous_gpa": 3.2,
        "parent_education": "Bachelor",
        "extracurricular": "Sports"
    }

    prediction = predictor.predict_performance(sample_student)
    print(f"\nSample Prediction:")
    print(f"Predicted Grade: {prediction['predicted_grade']}")
    print(f"Performance Category: {prediction['performance_category']}")

if __name__ == "__main__":
    main()