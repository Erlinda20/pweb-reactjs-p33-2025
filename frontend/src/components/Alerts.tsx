// Modal Alerts with smooth enter/exit animation and single shared queue
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type AlertType = "success" | "error" | "info";

interface AlertAction {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
}

interface AlertData {
    id: string;
    message: string;
    description?: string;
    type: AlertType;
    duration: number;
    actions?: AlertAction[];
}

let sharedRoot: Root | null = null;
let containerEl: HTMLDivElement | null = null;
let addAlertRef: ((a: AlertData) => void) | null = null;
// hold alerts that are fired before the AlertsRoot effect sets addAlertRef
const pendingAlerts: AlertData[] = [];

// simple counter to guarantee uniqueness even on very fast clicks
let idCounter = 0;

export function showAlert(
    message: string,
    type: AlertType,
    duration = 10000,
    options?: {
        description?: string;
        actions?: AlertAction[];
    }
) {
    if (!containerEl) {
        containerEl = document.createElement("div");
        document.body.appendChild(containerEl);
    }
    if (!sharedRoot) {
        sharedRoot = createRoot(containerEl);
        sharedRoot.render(<AlertsRoot />);
    }
    const id = `alert-${Date.now()}-${++idCounter}`;
    const alert: AlertData = { 
        id, 
        message, 
        type, 
        duration,
        description: options?.description,
        actions: options?.actions
    };

    // if AlertsRoot has mounted and set addAlertRef, use it
    // otherwise push to pending and it will be flushed by the effect
    if (addAlertRef) {
        addAlertRef(alert);
    } else {
        pendingAlerts.push(alert);
    }
}

// Alerts container: multiple alerts show concurrently; each manages its own lifecycle
function AlertsRoot() {
    const MAX_VISIBLE = 10;

    // use a single state object so we can update visible + waiting atomically
    const [state, setState] = useState<{ visible: AlertData[]; waiting: AlertData[] }>({
        visible: [],
        waiting: [],
    });

    // expose addAlert to showAlert -> push to visible if space else to waiting
    useEffect(() => {
        addAlertRef = (alert: AlertData) => {
            setState((prev) => {
                if (prev.visible.length < MAX_VISIBLE) {
                    return { visible: [...prev.visible, alert], waiting: prev.waiting };
                }
                return { visible: prev.visible, waiting: [...prev.waiting, alert] };
            });
        };

        // flush any pending alerts that were queued before mount
        if (pendingAlerts.length > 0) {
            setState((prev) => {
                const toFlush = pendingAlerts.splice(0); // take all pending
                const space = Math.max(0, MAX_VISIBLE - prev.visible.length);
                const canShow = toFlush.slice(0, space);
                const queued = toFlush.slice(space);
                return {
                    visible: [...prev.visible, ...canShow],
                    waiting: [...prev.waiting, ...queued],
                };
            });
        }

        return () => {
            addAlertRef = null;
        };
    }, []);

    const removeById = (id: string) => {
        setState((prev) => {
            // remove from visible
            const newVisible = prev.visible.filter((a) => a.id !== id);
            // if there is someone waiting, move exactly one into visible
            if (prev.waiting.length > 0 && newVisible.length < MAX_VISIBLE) {
                const next = prev.waiting[0];
                return {
                    visible: [...newVisible, next],
                    waiting: prev.waiting.slice(1),
                };
            }
            return { visible: newVisible, waiting: prev.waiting };
        });
    };

    return (
        // container pinned top-right, items stack downward
        <div className="fixed top-4 right-4 flex flex-col gap-2 items-end z-[9999] pointer-events-none">
            {state.visible.map((item) => (
                <AlertItem key={item.id} data={item} onDone={() => removeById(item.id)} />
            ))}
        </div>
    );
}
function AlertItem({ data, onDone }: { data: AlertData; onDone: () => void }) {
    const { message, description, type, duration, actions } = data;
    const [visible, setVisible] = useState(false);
    const doneRef = useRef(false);
    const onDoneRef = useRef(onDone);

    // Update onDone ref without triggering effect
    useEffect(() => {
        onDoneRef.current = onDone;
    }, [onDone]);

    // ensure onDone is only invoked once per item
    const callDone = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        onDoneRef.current();
    };

    useEffect(() => {
        // trigger enter animation on next frame
        const raf = requestAnimationFrame(() => setVisible(true));

        // start exit after duration
        const hideTimer = setTimeout(() => {
            setVisible(false);
        }, duration);

        // fallback: if transitionend doesn't fire for some reason, remove after duration + 500ms
        const cleanupTimer = setTimeout(() => {
            callDone();
        }, duration + 500);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(hideTimer);
            clearTimeout(cleanupTimer);
        };
        // Removed onDone from dependencies - using ref instead!
    }, [duration, data.id, message, description, type, actions]);

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        // only remove when opacity/transform transition finished AND we are in hidden state
        if (!visible && (e.propertyName === "opacity" || e.propertyName === "transform")) {
            callDone();
        }
    };

    // Determine icon and color based on type
    let IconComponent = Info;
    let iconColor = "text-blue-500";
    
    if (type === "success") {
        IconComponent = CheckCircle;
        iconColor = "text-green-500";
    } else if (type === "error") {
        IconComponent = XCircle;
        iconColor = "text-red-500";
    }

    // pointer-events-none on container; enable events for alert content
    return (
        <div
            role="status"
            aria-live="polite"
            onTransitionEnd={handleTransitionEnd}
            className={`pointer-events-auto w-full max-w-md p-5 rounded-xl shadow-xl bg-white border border-gray-200 transform transition-all duration-300 ease-out
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
            <div className="flex items-start gap-4">
                {/* Icon with animation */}
                <div className={`flex-shrink-0 ${visible ? 'animate-scale-in' : ''}`}>
                    <IconComponent className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title/Message - Bold */}
                    <div className="font-semibold text-gray-900 text-base mb-1">
                        {message}
                    </div>
                    
                    {/* Description - Optional */}
                    {description && (
                        <div className="text-gray-600 text-sm leading-relaxed">
                            {description}
                        </div>
                    )}
                    
                    {/* Action Buttons - Optional */}
                    {actions && actions.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        action.onClick();
                                        setVisible(false);
                                    }}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        action.variant === "primary"
                                            ? `${iconColor.replace('text-', 'bg-')} text-white hover:opacity-90`
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Close Button */}
                <button
                    onClick={() => {
                        setVisible(false);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100 p-1"
                    aria-label="Close alert"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}


export default AlertsRoot;

// ============== CARA PENGGUNAAN ==============

// 1. Simple alert (hanya title)
// showAlert("Operation successful!", "success");

// 2. Alert dengan description
// showAlert(
//     "Email Sent",
//     "success", 
//     5000,
//     {
//         description: "Your email has been sent successfully to all recipients."
//     }
// );

// 3. Alert dengan description dan action buttons
// showAlert(
//     "Update Available", 
//     "info",
//     10000,
//     {
//         description: "A new version of the application is available. Please update to get the latest features.",
//         actions: [
//             {
//                 label: "Update Now",
//                 variant: "primary",
//                 onClick: () => console.log("Update clicked")
//             },
//             {
//                 label: "Later",
//                 variant: "secondary",
//                 onClick: () => console.log("Later clicked")
//             }
//         ]
//     }
// );

// 4. Error alert dengan actions
// showAlert(
//     "Delete Failed",
//     "error",
//     8000,
//     {
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.",
//         actions: [
//             {
//                 label: "Retry",
//                 variant: "primary",
//                 onClick: () => console.log("Retry")
//             },
//             {
//                 label: "Dismiss",
//                 variant: "secondary",
//                 onClick: () => console.log("Dismissed")
//             }
//         ]
//     }
// );