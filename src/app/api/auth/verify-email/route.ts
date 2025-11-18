import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const foundUser = await db.user.findUnique({
      where: { email }
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (foundUser.emailVerified) {
      return NextResponse.json(
        { success: true, message: "Email already verified" },
        { status: 200 }
      );
    }

    // Verify OTP via Supabase Auth
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email'
    });

    if (error) {
      console.error("Supabase OTP verification error:", error);
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update user's emailVerified status in our database
    await db.user.update({
      where: { id: foundUser.id },
      data: { 
        emailVerified: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}