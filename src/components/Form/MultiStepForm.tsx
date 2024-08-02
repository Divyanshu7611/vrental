"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Step1 from "./Step1";
import Step2 from "./Step2";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const methods = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onSubmit = (data: FormValues) => {
    if (step === 2) {
      console.log(data); // Submit final values
    } else {
      nextStep();
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="step-indicators">
          <span className={step >= 1 ? "active" : ""}>1</span>
          <span className={step >= 2 ? "active" : ""}>2</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Step1 />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Step2 />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          {step > 1 && (
            <button type="button" onClick={prevStep}>
              Back
            </button>
          )}
          <button type="submit">{step === 2 ? "Submit" : "Next"}</button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
