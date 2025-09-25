Start-Job { cd backend; npm run dev }
Start-Job { cd frontend; npm run dev }

# Keep the shell alive so jobs don’t end immediately
Receive-Job -Wait -AutoRemoveJob *