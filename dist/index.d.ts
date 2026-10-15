export type TokenizedEquityInstrument = {
    symbol: string;
    instrument_type: "tokenized_equity_spot";
    underlying_ticker: string;
    issuer_name: string;
    quote_currency: string;
    last_price: number;
    change_24h: number | null;
    provider_timestamp: number | null;
    market_session_status: "available" | "unavailable";
    source: "Bitget Reality spot";
};
export type InstrumentPage = {
    data: TokenizedEquityInstrument[];
    next_cursor: string | null;
    generated_at: number;
    request_id: string;
};
export type ResearchJobStatus = "queued" | "running" | "retry_wait" | "complete" | "failed" | "cancelled";
export type ResearchJob = {
    job_id: string;
    ticker: string;
    status: ResearchJobStatus;
    attempts: number;
    max_attempts: number;
    result: Record<string, unknown> | null;
    error: {
        code: string;
        message: string;
    } | null;
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
    retry_at: string | null;
    request_id: string;
};
export type WebhookEvent = "research.job.completed" | "research.job.failed";
export type WebhookEndpoint = {
    id: string;
    project_id: string;
    organization_id: string;
    name: string;
    url: string;
    events: WebhookEvent[];
    enabled: boolean;
    created_at: string;
    updated_at: string;
};
export type WebhookDelivery = {
    id: string;
    endpoint_id: string;
    project_id: string;
    event_id: string;
    event_type: WebhookEvent;
    payload: Record<string, unknown>;
    status: "pending" | "sending" | "retry_wait" | "succeeded" | "failed" | "cancelled";
    attempt_count: number;
    last_status_code: number | null;
    last_error_code: string | null;
    last_duration_ms: number | null;
    created_at: string;
    completed_at: string | null;
    endpoint_name: string;
    tic_webhook_delivery_attempts: Array<{
        attempt_number: number;
        status_code: number | null;
        duration_ms: number | null;
        error_code: string | null;
        created_at: string;
    }>;
};
export type WebhookMutationResponse = {
    endpoint: WebhookEndpoint;
    signing_secret?: string;
    request_id: string;
};
export type WebhookEndpointInput = {
    name: string;
    url: string;
    events: WebhookEvent[];
};
export type WebhookEndpointUpdate = {
    name?: string;
    url?: string;
    events?: WebhookEvent[];
    enabled?: boolean;
    rotate_secret?: true;
};
export declare class TidelightApiError extends Error {
    readonly status: number;
    readonly code: string;
    readonly requestId: string | null;
    constructor(status: number, code: string, message: string, requestId: string | null);
}
type Fetch = typeof fetch;
export type TidelightClientOptions = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
    maxRetries?: number;
    fetch?: Fetch;
};
export declare class TidelightClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly timeoutMs;
    private readonly maxRetries;
    private readonly transport;
    constructor(options: TidelightClientOptions);
    listTokenizedEquities(options?: {
        limit?: number;
        cursor?: string;
        signal?: AbortSignal;
    }): Promise<InstrumentPage>;
    startCompanyResearch(ticker: string, idempotencyKey: string, options?: {
        signal?: AbortSignal;
    }): Promise<{
        job_id: string;
        status: ResearchJobStatus;
        duplicate: boolean;
        request_id: string;
    }>;
    getResearchJob(jobId: string, options?: {
        signal?: AbortSignal;
    }): Promise<ResearchJob>;
    cancelResearchJob(jobId: string, options?: {
        signal?: AbortSignal;
    }): Promise<{
        job_id: string;
        status: string;
        request_id: string;
    }>;
    waitForResearchJob(jobId: string, options?: {
        intervalMs?: number;
        timeoutMs?: number;
        signal?: AbortSignal;
    }): Promise<ResearchJob>;
    listWebhooks(options?: {
        signal?: AbortSignal;
    }): Promise<{
        endpoints: WebhookEndpoint[];
        request_id: string;
    }>;
    createWebhook(input: WebhookEndpointInput, options?: {
        signal?: AbortSignal;
    }): Promise<WebhookMutationResponse>;
    updateWebhook(endpointId: string, input: WebhookEndpointUpdate, options?: {
        signal?: AbortSignal;
    }): Promise<WebhookMutationResponse>;
    disableWebhook(endpointId: string, options?: {
        signal?: AbortSignal;
    }): Promise<{
        disabled: true;
        request_id: string;
    }>;
    listWebhookDeliveries(options?: {
        signal?: AbortSignal;
    }): Promise<{
        deliveries: WebhookDelivery[];
        request_id: string;
    }>;
    private validateWebhookId;
    private validateWebhookUrl;
    private validateWebhookEvents;
    private validateWebhookInput;
    private validateWebhookUpdate;
    private jobRequest;
    tokenizedEquities(options?: {
        limit?: number;
        signal?: AbortSignal;
    }): AsyncGenerator<TokenizedEquityInstrument>;
    private pause;
}
export {};
