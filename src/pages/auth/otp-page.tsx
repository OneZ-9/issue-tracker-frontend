import PageContainerWrapper from "@/components/custom/PageContainerWrapper";
import OTPForm from "@/features/auth/OTPForm";

function OTPPage() {
  return (
    <PageContainerWrapper className="flex items-center justify-center">
      <OTPForm />
    </PageContainerWrapper>
  );
}

export default OTPPage;
