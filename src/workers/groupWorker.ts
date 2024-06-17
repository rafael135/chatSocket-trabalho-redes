import { GroupWorkerMessage } from "@/types/Worker"



self.onmessage = (e: MessageEvent) => {
    let message = e.data as GroupWorkerMessage;

    
}