import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Clock,
  CheckCircle,
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

const verificationSchema = z.object({
  emailCode: z.string().length(6, "Verification code must be 6 digits"),
  phoneCode: z.string().length(6, "Verification code must be 6 digits"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

interface VerificationData {
  userId: string;
  emailToken: string;
  phoneToken: string;
  email: string;
  phone: string;
}

export default function VerificationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);
  const [emailResendCooldown, setEmailResendCooldown] = useState(0);
  const [phoneResendCooldown, setPhoneResendCooldown] = useState(0);
  const [completedVerifications, setCompletedVerifications] = useState({
    email: false,
    phone: false,
  });

  const form = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      emailCode: "",
      phoneCode: "",
    },
  });

  // Get verification data from registration
  useEffect(() => {
    const storedData = localStorage.getItem("verificationData");
    if (storedData) {
      setVerificationData(JSON.parse(storedData));
    } else {
      // Redirect back to register if no verification data
      setLocation("/register");
    }
  }, [setLocation]);

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
    mutationFn: ({ token, code }: { token: string; code: string }) =>
      verifyEmail(verificationData!.userId, token, code),
    onSuccess: () => {
      setCompletedVerifications((prev) => ({ ...prev, email: true }));
      toast({
        title: "Email verified successfully!",
        description: "Your email has been verified.",
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to verify email";
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: message,
      });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: ({ token, code }: { token: string; code: string }) =>
      verifyPhone(verificationData!.userId, token, code),
    onSuccess: () => {
      setCompletedVerifications((prev) => ({ ...prev, phone: true }));
      toast({
        title: "Phone verified successfully!",
        description: "Your phone number has been verified.",
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to verify phone";
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: message,
      });
    },
  });

  const resendEmailMutation = useMutation({
    mutationFn: () =>
      resendVerificationCode(
        verificationData!.userId,
        "email",
        verificationData!.emailToken
      ),
    onSuccess: () => {
      setEmailResendCooldown(60); // 60 seconds cooldown
      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your email.",
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

  const resendPhoneMutation = useMutation({
    mutationFn: () =>
      resendVerificationCode(
        verificationData!.userId,
        "phone",
        verificationData!.phoneToken
      ),
    onSuccess: () => {
      setPhoneResendCooldown(60); // 60 seconds cooldown
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
    if (verificationData) {
      verifyEmailMutation.mutate({ token: verificationData.emailToken, code });
    }
  };

  const handlePhoneVerification = (code: string) => {
    if (verificationData) {
      verifyPhoneMutation.mutate({ token: verificationData.phoneToken, code });
    }
  };

  const handleResendEmail = () => {
    if (emailResendCooldown === 0) {
      resendEmailMutation.mutate();
    }
  };

  const handleResendPhone = () => {
    if (phoneResendCooldown === 0) {
      resendPhoneMutation.mutate();
    }
  };

  const allVerified =
    completedVerifications.email && completedVerifications.phone;

  useEffect(() => {
    if (allVerified) {
      // Redirect to login after both verifications are complete
      const timer = setTimeout(() => {
        setLocation("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [allVerified, setLocation]);

  if (!verificationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
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
              <CardContent className="p-0">
                <Form {...form}>
                  <form className="space-y-6">
                    {/* Email Verification */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Email Verification
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Sent to {verificationData.email}
                          </p>
                        </div>
                        {completedVerifications.email && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>

                      {!completedVerifications.email && (
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
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Phone Verification
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Sent to {verificationData.phone}
                          </p>
                        </div>
                        {completedVerifications.phone && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>

                      {!completedVerifications.phone && (
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

                    <div className="pt-6 border-t">
                      <Button
                        type="button"
                        onClick={() => setLocation("/login")}
                        variant="outline"
                        className="w-full"
                      >
                        Continue to Login
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
