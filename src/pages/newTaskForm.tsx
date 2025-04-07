import React from "react";
import { useForm, Controller } from "react-hook-form";
import "./newTaskForm.css";

interface FormData {
  team: string;
  title: string;
  category: string;
  weekDays: string[]; // Changed to an array of strings
  processUrl: string;
}

const NewTaskForm: React.FC = () => {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: "",
      category: "",
      weekDays: [], // Default to an empty array
      processUrl: "",
    },
  });

  const weekDays = watch("weekDays"); 

  const toggleWeekDay = (day: string) => {
    const updatedWeekDays = weekDays.includes(day)
      ? weekDays.filter((d) => d !== day) 
      : [...weekDays, day]; 
    setValue("weekDays", updatedWeekDays); 
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset(); // Reset form after submission
  };

  return (
    <form className="new-task-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="team">Team:</label>
        <input
          type="text"
          id="team"
          {...register("team", { required: true })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          {...register("title", { required: true })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          {...register("category", { required: true })}
        />
      </div>
      <div className="form-group">
        <label>Week Days:</label>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <div key={day} className="checkbox-group">
            <input
              type="checkbox"
              id={day}
              checked={weekDays.includes(day)}
              onChange={() => toggleWeekDay(day)} 
            />
            <label htmlFor={day}>{day}</label>
          </div>
        ))}
      </div>
      <div className="form-group">
        <label htmlFor="processUrl">Process URL:</label>
        <input
          type="url"
          id="processUrl"
          {...register("processUrl", { required: true })}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewTaskForm;
