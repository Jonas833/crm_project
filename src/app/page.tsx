import CircularText from '@/components/CircularText';

export default async function Page() {
return(
<div style={{ backgroundColor: "black", minHeight: "100vh" }}>
<CircularText
  text="Loading*Loading"
  onHover="speedUp"
  spinDuration={20}
  className="custom-class"
/>
</div>
)
}
