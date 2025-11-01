import heroImage from "../assets/hero.png"

const Hero = () => {
    return (
        <div className="relative w-full overflow-hidden rounded-lg">
            <img src={heroImage} className="w-full h-full lg:h-[600px] object-cover"/>
        </div>
    )
}
export default Hero