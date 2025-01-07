import {motion, useSpring, useTransform} from "framer-motion"
import {useEffect} from "react"

export default function AnimatedNumber({ value, className }) {
    let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
    let display = useTransform(spring, (current) =>
        current.toFixed(2).toLocaleString()
    )

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    return (
        <div className={`flex flex-row gap-0 ${className}`}>
            $<motion.span>{display}</motion.span>
        </div>
    )
}