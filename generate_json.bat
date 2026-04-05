@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "OUTPUT=images.json"
echo [ > "%OUTPUT%"

rem global prefix for commas
set "PREFIX="

for /d %%C in ("images\*") do (
    set "CATEGORY=%%~nxC"

    rem --- SPECIAL CASE: category == "title" ---
    if /i "%%~nxC"=="title" (

        set "EVENT=title"
        set "PATH=title/"
        set "PICTURES="
        set "FIRST_PIC=1"

        pushd "%%C"
        for %%F in (*) do (
            if !FIRST_PIC! == 1 (
                set PICTURES="%%~nxF"
                set FIRST_PIC=0
            ) else (
                set PICTURES=!PICTURES!,"%%~nxF"
            )
        )
        popd

        rem write object with prefix
        echo !PREFIX!{ >> "%OUTPUT%"
        echo     "filename": "", >> "%OUTPUT%"
        echo     "title": "!EVENT!", >> "%OUTPUT%"
        echo     "category": "!CATEGORY!", >> "%OUTPUT%"
        echo     "path": "!PATH!", >> "%OUTPUT%"
        echo     "pictures": [!PICTURES!] >> "%OUTPUT%"
        echo   } >> "%OUTPUT%"

        set "PREFIX=,"

    ) else (

        rem --- NORMAL CASE: category/event/files ---
        for /d %%E in ("%%C\*") do (
            set "EVENT=%%~nxE"
            set "PATH=!CATEGORY!/!EVENT!/"
            set "PICTURES="
            set "FIRST_PIC=1"

            pushd "%%E"
            for %%F in (*) do (
                if !FIRST_PIC! == 1 (
                    set PICTURES="%%~nxF"
                    set FIRST_PIC=0
                ) else (
                    set PICTURES=!PICTURES!,"%%~nxF"
                )
            )
            popd

            rem write object with prefix
            echo !PREFIX!{ >> "%OUTPUT%"
            echo     "filename": "", >> "%OUTPUT%"
            echo     "title": "!EVENT!", >> "%OUTPUT%"
            echo     "category": "!CATEGORY!", >> "%OUTPUT%"
            echo     "path": "!PATH!", >> "%OUTPUT%"
            echo     "pictures": [!PICTURES!] >> "%OUTPUT%"
            echo   } >> "%OUTPUT%"

            set "PREFIX=,"
        )
    )
)

echo ] >> "%OUTPUT%"

echo Done! Generated %OUTPUT%