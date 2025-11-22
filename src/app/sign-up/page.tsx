import Particles from '@/components/Particles';
import GlobalClickSpark from "@/components/GlobalClickSpark";

 
export default function Page() {
  return (
    
    
      
      <div style={{ backgroundColor: "black",width: "100%", height: "flex", position: "relative" }}>
        <Particles 
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          
        />
       
      </div>
    
    
  );
}
