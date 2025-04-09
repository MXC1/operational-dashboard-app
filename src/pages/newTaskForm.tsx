import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./newTaskForm.css";

interface FormData {
  team: string;
  title: string;
  category: string;
  weekDays: string[]; 
  processUrl: string;
}

interface NewTaskFormProps {
  selectedTeam: string | null;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ selectedTeam }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      team: "",
      title: "",
      category: "",
      weekDays: [], 
      processUrl: "",
    },
  });

  useEffect(() => {
    if (selectedTeam) {
      setValue("team", selectedTeam);
    }
  }, [selectedTeam, setValue]);

  const weekDays = watch("weekDays"); 

  const toggleWeekDay = (day: string) => {
    const updatedWeekDays = weekDays.includes(day)
      ? weekDays.filter((d) => d !== day) 
      : [...weekDays, day]; 
    setValue("weekDays", updatedWeekDays); 
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev/new-task-configuration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      console.log("Task submitted successfully:", await response.json());
      reset();
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  return (
    <form className="new-task-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>{selectedTeam} New Task Form</h2>
      <div className="form-group">
        <label htmlFor="team">Team:</label>
        <input
          type="text"
          id="team"
          {...register("team", { required: true })}
          disabled={!!selectedTeam} 
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
          {...register("processUrl", { required: false })}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewTaskForm;
