import React, { useEffect, useRef, useState } from "react";

const Stepper = ({ stepsconfig = [] }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(false);
  const [margins, setMargins] = useState({
    marginLeft: 0,
    marginRight: 0,
  });
  const stepRef = useRef([]);
  const [isValid, setIsValid] = useState(true); // Add state for validation

  useEffect(() => {
    if (stepRef.current.length) {
      const leftMargin = stepRef.current[0].offsetWidth / 2;
      const rightMargin = stepRef.current[stepsconfig.length - 1].offsetWidth / 2;
      setMargins({
        marginLeft: leftMargin,
        marginRight: rightMargin,
      });
    }
  }, [stepsconfig.length]);

  if (!stepsconfig.length) {
    return null; // Return null instead of empty fragment
  }

  const handleNext = () => {
    if (!isValid) {
      alert("Please complete the required fields or meet the conditions to proceed.");
      return;
    }

    setCurrentStep((prevStep) => {
      if (prevStep === stepsconfig.length) {
        setCompletedSteps(true);
        return prevStep;
      } else {
        return prevStep + 1;
      }
    });
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const validateStep = () => {
    const stepIndex = currentStep - 1;
    const validation = stepsconfig[stepIndex]?.validate;
    if (validation) {
      setIsValid(validation()); // Call validation function from the step config
    } else {
      setIsValid(true); // Default to true if no validation function is provided
    }
  };

  useEffect(() => {
    validateStep();
  }, [currentStep]);

  const calculateProgressBarWidth = () => {
    return ((currentStep - 1) / (stepsconfig.length - 1)) * 100;
  };

  const ActiveComponent = stepsconfig[currentStep - 1]?.Component;

  return (
    <>
      <div className="stepper">
        {stepsconfig.map((step, index) => {
          const isFourthStep = index === 3; // Check if it's the fourth step (0-based index)
          return (
            <div
              key={step.name}
              ref={(el) => (stepRef.current[index] = el)}
              className={`step ${
                currentStep > index + 1 || completedSteps ? "complete" : ""
              }${currentStep === index + 1 ? "active" : ""} ${
                isFourthStep ? "fourth-step" : ""
              }`}
            >
              <div className="step_number">
                {currentStep > index + 1 || completedSteps ? (
                  <span>&#10003;</span>
                ) : (
                  index + 1
                )}
              </div>
              <div className="step_name">{step.name}</div>
            </div>
          );
        })}
        <div
          className="progress_bar"
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: margins.marginLeft,
            marginRight: margins.marginRight,
          }}
        >
          <div
            className="progress"
            style={{ width: `${calculateProgressBarWidth()}%` }}
          ></div>
        </div>
      </div>
      {ActiveComponent && <ActiveComponent />}
      <div className="button-group">
        {currentStep > 1 && (
          <button className="btn btn2" onClick={handlePrevious}>
            Previous
          </button>
        )}
        {!completedSteps && (
          <button className="btn btn2" onClick={handleNext}>
            {currentStep === stepsconfig.length ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </>
  );
};

export default Stepper;
