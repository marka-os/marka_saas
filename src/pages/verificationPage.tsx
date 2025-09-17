import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@marka/components/ui/button";
import { Card, CardContent } from "@marka/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@marka/components/ui/form";
import { Input } from "@marka/components/ui/input";
import { useToast } from "@marka/hooks/use-toast";
import {
  verifyEmail,
  verifyPhone,
  resendVerificationCode,
} from "@marka/lib/api";
import { useAuthStore } from "@marka/stores/auth-store";

const verificationSchema = z.object({
  emailCode: z.string().length(6, "Verification code must be 6 digits"),
  phoneCode: z.string().length(6, "Verification code must be 6 digits"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

export default function VerificationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    verificationUserId,
    verificationEmail,
    verificationPhone,
    isEmailVerified,
    isPhoneVerified,
    setEmailVerified,
    setPhoneVerified,
    clearVerificationData,
  } = useAuthStore();

  const [emailResendCooldown, setEmailResendCooldown] = useState(0);
  const [phoneResendCooldown, setPhoneResendCooldown] = useState(0);
  const [loading, setLoading] = useState(true);

  const form = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      emailCode: "",
      phoneCode: "",
    },
  });

  // Check if we have verification data
  useEffect(() => {
    if (!verificationUserId) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Please complete the registration process first.",
      });
      setLocation("/register");
    } else {
      setLoading(false);
    }
  }, [verificationUserId, setLocation, toast]);

  // Handle resend cooldown timers
  useEffect(() => {
    const emailTimer = setInterval(() => {
      setEmailResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const phoneTimer = setInterval(() => {
      setPhoneResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(emailTimer);
      clearInterval(phoneTimer);
    };
  }, []);

  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) =>
      verifyEmail(verificationUserId!, code, verificationEmail!),
    onSuccess: () => {
      setEmailVerified(true);
      toast({
        title: "Email verified successfully!",
        description: "Your email has been verified.",
      });
    },
    onError: (error: any) => {
      let message = "Failed to verify phone";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: message,
      });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: (code: string) =>
      verifyPhone(verificationUserId!, code, verificationPhone!),
    onSuccess: () => {
      setPhoneVerified(true);
      toast({
        title: "Phone verified successfully!",
        description: "Your phone number has been verified.",
      });
    },
    onError: (error: any) => {
      let message = "Failed to verify phone";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: message,
      });
    },
  });

  const resendEmailMutation = useMutation({
    mutationFn: () =>
      resendVerificationCode(verificationUserId!, "email", verificationEmail!),
    onSuccess: () => {
      setEmailResendCooldown(60);
      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: any) => {
      let message = "Failed to verify phone";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Resend failed",
        description: message,
      });
    },
  });

  const resendPhoneMutation = useMutation({
    mutationFn: () =>
      resendVerificationCode(verificationUserId!, "phone", verificationPhone!),
    onSuccess: () => {
      setPhoneResendCooldown(60);
      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your phone.",
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to resend code";
      toast({
        variant: "destructive",
        title: "Resend failed",
        description: message,
      });
    },
  });

  const handleEmailVerification = (code: string) => {
    if (verificationUserId) {
      verifyEmailMutation.mutate(code);
    }
  };

  const handlePhoneVerification = (code: string) => {
    if (verificationUserId) {
      verifyPhoneMutation.mutate(code);
    }
  };

  const handleResendEmail = () => {
    if (emailResendCooldown === 0 && verificationUserId) {
      resendEmailMutation.mutate();
    }
  };

  const handleResendPhone = () => {
    if (phoneResendCooldown === 0 && verificationUserId) {
      resendPhoneMutation.mutate();
    }
  };

  const allVerified = isEmailVerified && isPhoneVerified;

  useEffect(() => {
    if (allVerified) {
      // Clear verification data after successful verification
      const timer = setTimeout(() => {
        clearVerificationData();
        setLocation("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [allVerified, setLocation, clearVerificationData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!verificationUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Verification Error
            </h2>
            <p className="text-muted-foreground mb-6">
              No verification data found. Please complete registration first.
            </p>
            <Button onClick={() => setLocation("/register")}>
              Return to Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000"
          alt="Uganda teacher with students"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Right side - Verification Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground"
              onClick={() => setLocation("/register")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Register
            </Button>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Marka</span>
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              Verify Your Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please verify your email and phone to complete your registration
            </p>
          </div>

          {allVerified ? (
            <Card className="border-0 shadow-none p-0">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Verification Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been successfully verified. Redirecting to
                  login...
                </p>
                <Button onClick={() => setLocation("/login")}>
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-none p-0">
              <CardContent className="p-6">
                <Form {...form}>
                  {/* Email Verification */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 dark:bg-blue-900">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Email Verification
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Sent to {verificationEmail}
                        </p>
                      </div>
                      {isEmailVerified && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>

                    {!isEmailVerified && (
                      <>
                        <FormField
                          control={form.control}
                          name="emailCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Verification Code</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter 6-digit code"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value.length === 6) {
                                      handleEmailVerification(e.target.value);
                                    }
                                  }}
                                  disabled={verifyEmailMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendEmail}
                          disabled={
                            emailResendCooldown > 0 ||
                            resendEmailMutation.isPending
                          }
                          className="w-full"
                        >
                          {resendEmailMutation.isPending ? (
                            <>Sending...</>
                          ) : emailResendCooldown > 0 ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Resend in {emailResendCooldown}s
                            </>
                          ) : (
                            "Resend Email Code"
                          )}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Phone Verification */}
                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 dark:bg-green-900">
                        <Phone className="w-4 h-4 text-green-600 dark:text-green-200" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Phone Verification
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Sent to {verificationPhone}
                        </p>
                      </div>
                      {isPhoneVerified && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>

                    {!isPhoneVerified && (
                      <>
                        <FormField
                          control={form.control}
                          name="phoneCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Verification Code</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter 6-digit code"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value.length === 6) {
                                      handlePhoneVerification(e.target.value);
                                    }
                                  }}
                                  disabled={verifyPhoneMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendPhone}
                          disabled={
                            phoneResendCooldown > 0 ||
                            resendPhoneMutation.isPending
                          }
                          className="w-full"
                        >
                          {resendPhoneMutation.isPending ? (
                            <>Sending...</>
                          ) : phoneResendCooldown > 0 ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Resend in {phoneResendCooldown}s
                            </>
                          ) : (
                            "Resend SMS Code"
                          )}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="pt-6 border-t mt-6">
                    <Button
                      type="button"
                      onClick={() => setLocation("/login")}
                      variant="outline"
                      className="w-full"
                    >
                      Continue to Login
                    </Button>
                  </div>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
