# Step 1: Use the official Python image as a base
FROM python:3.9-slim

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the requirements file into the container and install dependencies
COPY requirements.txt .
RUN apt-get update && apt-get install -y iputils-ping && \
    pip install --no-cache-dir -r requirements.txt

# Step 4: Copy the SQLite database file into the container (if it exists)
COPY database.db /app/database.db

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Set environment variables
ENV FLASK_APP=task.py
ENV FLASK_ENV=development

# Step 7: Expose the port the app will run on
EXPOSE 5001

# Step 8: Run the Flask app when the container starts
CMD ["python", "task.py"]
