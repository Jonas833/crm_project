import Particles from '@/components/Particles';
import GlobalClickSpark from "@/components/GlobalClickSpark";
import StarBorder from '@/components/StarBorder'
import Link from 'next/link'
  
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Particles
        particleColors={["#ffffff", "#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />

     
      <form
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,                    
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px",
          background: "rgba(33, 29, 33, 0.6)",
          borderRadius: "20px"
        }}
      >
      <h2>Setting up your Company</h2>

        <input  type="text" placeholder="Company Name"
        style={{
          border: "2px solid white",
          padding: "10px",
          borderRadius: "17px",
          background: "rgba(0, 0, 0, 0.18)",
          color: "white",
          outline: "none"
        }}
        />
        <p></p>
        <input type="Password" placeholder="Password"
        style={{
          border: "2px solid white",
          padding: "10px",
          borderRadius: "17px",
          background: "black",
          color: "white",
          outline: "none"
          
        }}
        />
        <input type="Password" placeholder="confirm Password"
        style={{
          border: "2px solid white",
          padding: "10px",
          borderRadius: "17px",
          background: "black",
          color: "white",
          outline: "none"
          
        }}
        />
        <nav>
            


        </nav>

        <StarBorder as="button" className="black" color="magenta" speed="5s">
          Login
        </StarBorder>
      </form>
      
    </div>
  );
}

