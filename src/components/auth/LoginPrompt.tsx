export function LoginPrompt() {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <a href="/sign-in" className="underline">
        Sign in
      </a>
      .
    </p>
  );
}