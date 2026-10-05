$ErrorActionPreference = "Stop"
$sourceDb = "reviewdatabase"
$targetDb = "srb_restore_check"
$user = "postgres"

$query = @"
SELECT table_name, 
       (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
FROM (
  SELECT table_name,
         query_to_xml(format('SELECT count(*) as cnt FROM %I.%I', table_schema, table_name), false, true, '') as xml_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
) t
ORDER BY table_name;
"@

$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "Getting counts from $sourceDb..."
$sourceCounts = (& $psql -U $user -d $sourceDb -t -A -c $query) -join ","

Write-Host "Getting counts from $targetDb..."
$targetCounts = (& $psql -U $user -d $targetDb -t -A -c $query) -join ","

if (-not $sourceCounts) {
    Write-Error "Failed to get counts from $sourceDb"
    exit 1
}

if (-not $targetCounts) {
    Write-Error "Failed to get counts from $targetDb"
    exit 1
}

$sourceClean = $sourceCounts.Trim()
$targetClean = $targetCounts.Trim()

if ($sourceClean -eq $targetClean) {
    Write-Host "SUCCESS: Row counts match perfectly between $sourceDb and $targetDb."
    exit 0
} else {
    Write-Host "ERROR: Row counts do not match!"
    Write-Host "`nSource ($sourceDb):"
    Write-Host $sourceCounts
    Write-Host "`nTarget ($targetDb):"
    Write-Host $targetCounts
    exit 1
}
