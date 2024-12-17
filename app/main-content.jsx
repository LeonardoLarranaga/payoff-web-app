import {motion} from "framer-motion"
import {useNavigation} from "@/contexts/navigation-context"

export default function MainContent({children}) {
    const { isNavigationMenuOpen } = useNavigation();

    return (
        <motion.div
            className="pt-1 pl-1"
            animate={{
                marginLeft: isNavigationMenuOpen && window.innerWidth >= 700 ? '14rem' : '0',
            }}
            transition={{ type: 'spring', duration: 0.45 }}
        >
            {children}
        </motion.div>
    )
}