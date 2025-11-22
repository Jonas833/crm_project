import Particles from '@/components/Particles';
import GlobalClickSpark from "@/components/GlobalClickSpark";
import StarBorder from '@/components/StarBorder'
  
 
export default function Page() {
    return (
      <div className="p-10 bg-black min-h-screen flex items-center justify-center">
        <StarBorder as="button" className="custom-class" color="cyan" speed="5s">
          Login
        </StarBorder>
      </div>
    );
  }
  