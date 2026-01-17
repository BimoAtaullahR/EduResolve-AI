package config

import "os"

type FirebaseConfig struct {
	ServiceAccountPath string
}

func LoadFirebaseConfig() *FirebaseConfig {
	return &FirebaseConfig{
		ServiceAccountPath: os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH"),
	}
}
