"use client";

import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

export const TypedJs = ({ className }) => {
  // Create reference to store the DOM element containing the animation
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Business", "Personal", "Everyone"],
      typeSpeed: 100,
    });
    console.log({ typed });

    return () => {
      // Destroy Typed instance during cleanup to stop animation, prevents memory leaks
      typed.destroy();
    };
  }, []);

  return <span className={className} ref={el} />;
};
