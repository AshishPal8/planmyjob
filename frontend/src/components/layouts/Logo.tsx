import { LogoImage } from "@/assets";
import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Image src={LogoImage} alt="PlanurJob" width={200} height={100} />
    </div>
  );
};

export default Logo;
