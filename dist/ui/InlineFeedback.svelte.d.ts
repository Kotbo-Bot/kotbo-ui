interface Props {
    message?: string;
    error?: string;
    idleText?: string;
    state?: {
        state: {
            message: string;
            error: string;
        };
    };
}
declare const InlineFeedback: import("svelte").Component<Props, {}, "">;
type InlineFeedback = ReturnType<typeof InlineFeedback>;
export default InlineFeedback;
