import React,{useEffect, useRef} from 'react'

import { motion, useInView, useAnimation} from "framer-motion"



const RevealImg = ({ children, width = "full" }) => {
  const ref = useRef(null)
    const isInView = useInView(ref,{once:false})

    const mainControls = useAnimation();
    const slideControls = useAnimation();

    useEffect(() => {
      console.log(isInView,ref)
        // fire the animation
     if (isInView) {
            
            mainControls.start("visible")
            slideControls.start("visible")
      }
        else {
            mainControls.start("hidden")
            slideControls.start("hidden")
        }
      
    }, [isInView])
    
  return (
    <div ref={ref} style={{position:"",width,overflow:"hidden"}}>
          <motion.div
              variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible:{opacity:1,y:0}
              }}
              initial="hidden"
               animate={mainControls}
              transition={{duration:0.5,delay:0.25}}
          >{children}</motion.div>
    </div>
  )
}

export default RevealImg;
