import PageContainerWrapper from "@/components/custom/PageContainerWrapper";
import SignUpForm from "@/features/auth/SignUpForm";

function SignUpPage() {
  return (
    <PageContainerWrapper className="flex items-center justify-center">
      <SignUpForm />
    </PageContainerWrapper>
  );
}

export default SignUpPage;
