package firebase

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"github.com/BimoAtaullahR/ai-customer-support/internal/config"
	"google.golang.org/api/option"
)

func InitFirebase(cfg *config.FirebaseConfig) (*firebase.App, context.Context, error) {
	ctx := context.Background()
	opt := option.WithCredentialsFile(cfg.ServiceAccountPath)

	app, err := firebase.NewApp(ctx, nil, opt)
	return app, ctx, err
}
