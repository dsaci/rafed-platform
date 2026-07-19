$files = Get-ChildItem -Path "c:\Users\Surface\3D Objects\Rafed\src" -Recurse -Include *.tsx,*.ts
$changedCount = 0

foreach ($f in $files) {
    $orig = [System.IO.File]::ReadAllText($f.FullName)
    $content = $orig
    
    # 1. Colors with opacity
    $content = [regex]::Replace($content, "(?<!dark:)text-white/40", "text-slate-500 dark:text-white/40")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/50", "text-slate-500 dark:text-white/50")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/60", "text-slate-500 dark:text-white/60")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/70", "text-slate-600 dark:text-white/70")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/80", "text-slate-700 dark:text-white/80")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/90", "text-slate-800 dark:text-white/90")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/30", "text-slate-400 dark:text-white/30")
    $content = [regex]::Replace($content, "(?<!dark:)text-white/20", "text-slate-400 dark:text-white/20")
    
    # 2. Hovers
    $content = [regex]::Replace($content, "hover:text-white/70", "hover:text-slate-700 dark:hover:text-white/70")
    $content = [regex]::Replace($content, "hover:text-white/80", "hover:text-slate-700 dark:hover:text-white/80")
    $content = [regex]::Replace($content, "hover:text-white/90", "hover:text-slate-800 dark:hover:text-white/90")
    $content = [regex]::Replace($content, "hover:text-white/60", "hover:text-slate-600 dark:hover:text-white/60")
    $content = [regex]::Replace($content, "(?<!dark:)hover:bg-white/5\b", "hover:bg-slate-100 dark:hover:bg-white/5")
    $content = [regex]::Replace($content, "(?<!dark:)hover:bg-white/10\b", "hover:bg-slate-200 dark:hover:bg-white/10")
    $content = [regex]::Replace($content, "(?<!dark:)hover:border-white/10\b", "hover:border-slate-300 dark:hover:border-white/10")

    # 3. Placeholders
    $content = [regex]::Replace($content, "placeholder:text-white/20", "placeholder:text-slate-400 dark:placeholder:text-white/20")
    $content = [regex]::Replace($content, "placeholder:text-white/30", "placeholder:text-slate-400 dark:placeholder:text-white/30")
    $content = [regex]::Replace($content, "placeholder-white/40", "placeholder-slate-400 dark:placeholder-white/40")
    $content = [regex]::Replace($content, "placeholder-white/30", "placeholder-slate-400 dark:placeholder-white/30")

    # 4. Backgrounds and Borders
    $content = [regex]::Replace($content, "(?<!dark:)bg-white/5\b", "bg-slate-100 dark:bg-white/5")
    $content = [regex]::Replace($content, "(?<!dark:)bg-white/10\b", "bg-slate-200 dark:bg-white/10")
    $content = [regex]::Replace($content, "(?<!dark:)bg-white/\[0\.03\]", "bg-slate-50 dark:bg-white/[0.03]")
    $content = [regex]::Replace($content, "(?<!dark:)bg-white/\[0\.02\]", "bg-slate-50 dark:bg-white/[0.02]")
    $content = [regex]::Replace($content, "(?<!dark:)border-white/5\b", "border-slate-200 dark:border-white/5")
    $content = [regex]::Replace($content, "(?<!dark:)border-white/10\b", "border-slate-300 dark:border-white/10")

    # 5. Dark Base/Surface Backgrounds
    $content = [regex]::Replace($content, "(?<!dark:)bg-dark-base\b", "bg-white dark:bg-dark-base")
    $content = [regex]::Replace($content, "(?<!dark:)bg-dark-surface\b", "bg-white dark:bg-dark-surface")
    $content = [regex]::Replace($content, "(?<!dark:)bg-dark-surface/90", "bg-white/90 dark:bg-dark-surface/90")
    $content = [regex]::Replace($content, "(?<!dark:)bg-dark-surface/95", "bg-white/95 dark:bg-dark-surface/95")
    $content = [regex]::Replace($content, "(?<!dark:)from-dark-surface", "from-white dark:from-dark-surface")
    $content = [regex]::Replace($content, "(?<!dark:)to-dark-base", "to-slate-50 dark:to-dark-base")

    # 6. Just text-white
    $content = [regex]::Replace($content, "(?<!dark:)text-white\b(?!/)", "text-slate-900 dark:text-white")

    if ($orig -ne $content) {
        [IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Updated $($f.Name)"
        $changedCount++
    }
}

Write-Output "Total files updated: $changedCount"
