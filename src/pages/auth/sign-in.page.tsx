import PageContainerWrapper from "@/components/custom/PageContainerWrapper";
import SignInForm from "@/features/auth/SignInForm";

function SignInPage() {
  return (
    <PageContainerWrapper className="flex items-center justify-center">
      <SignInForm />
    </PageContainerWrapper>
  );
}

export default SignInPage;
