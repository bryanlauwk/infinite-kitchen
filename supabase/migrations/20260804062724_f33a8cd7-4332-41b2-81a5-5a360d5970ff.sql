CREATE TABLE public.rate_limit_hits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_hash text NOT NULL,
  bucket text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.rate_limit_hits TO service_role;

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;

CREATE INDEX rate_limit_hits_lookup_idx
  ON public.rate_limit_hits (bucket, client_hash, created_at DESC);

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  _client_hash text,
  _bucket text,
  _limit integer,
  _window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  used integer;
BEGIN
  IF _limit <= 0 OR _window_seconds <= 0 THEN
    RETURN false;
  END IF;

  DELETE FROM public.rate_limit_hits
  WHERE created_at < now() - interval '2 days';

  SELECT count(*) INTO used
  FROM public.rate_limit_hits
  WHERE client_hash = _client_hash
    AND bucket = _bucket
    AND created_at > now() - make_interval(secs => _window_seconds);

  IF used >= _limit THEN
    RETURN false;
  END IF;

  INSERT INTO public.rate_limit_hits (client_hash, bucket)
  VALUES (_client_hash, _bucket);

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, text, integer, integer) TO service_role;