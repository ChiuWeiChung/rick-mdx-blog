export default function LandingBackground() {
  const renderParticles = () => {
    const particleNumber = 10;
    return new Array(particleNumber).fill(0).map((_item, index) => {
      return <li key={index}></li>;
    });
  };
  return (
    <>
      <div className="absolute inset-0 -z-[1] bg-[linear-gradient(rgba(142,81,255,0.1)_1px,transparent_2px),linear-gradient(90deg,rgba(142,81,255,0.1)_1px,transparent_2px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:4rem_4rem]" />
      <ul className="landing-background">{renderParticles()}</ul>
    </>
  );
}