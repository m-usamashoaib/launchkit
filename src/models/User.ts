import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false }, // empty for OAuth-only accounts
    image: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Billing: kept in sync by the Stripe webhook
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    stripeCustomerId: { type: String, index: true, sparse: true },
    stripeSubscriptionId: String,
    subscriptionStatus: String,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) ?? mongoose.model<UserDoc>("User", userSchema);
