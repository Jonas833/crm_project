import Particles from '@/components/Particles';
import GlobalClickSpark from "@/components/GlobalClickSpark";

 
export default function Page() {
  return (
    
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
      <GlobalClickSpark />
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
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
       <input>text</input>
      </div>
    </div>
    
  );
}

