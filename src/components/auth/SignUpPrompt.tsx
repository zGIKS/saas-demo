import Link from "next/link";

export function SignUpPrompt() {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Don&apos;t have an account?{" "}
      <Link href="/" className="underline">
        Sign up
      </Link>
      .
    </p>
  );
}