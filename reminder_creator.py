def create_reminders(tasks):
    reminders = []
    for task in tasks:
        reminder_time = task['due_time'] - timedelta(minutes=30)  # Set reminder 30 min before
        reminders.append({
            'task_id': task['task_id'],
            'reminder_time': reminder_time
        })
    return reminders