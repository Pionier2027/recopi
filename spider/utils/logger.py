import logging
from logging import INFO, Formatter, StreamHandler, handlers
from pathlib import Path


def getLogger(log_name: str, log_file_path: str) -> logging.Logger:

    # ロガー生成
    logger = logging.getLogger(log_name)
    logger.setLevel(INFO)
    logger.propagate = False
    formatter = Formatter(
        "[%(levelname)s] [%(asctime)s] [%(filename)s:%(lineno)d] %(message)s"
    )

    file_path = Path(log_file_path)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    handler = handlers.RotatingFileHandler(
        filename=file_path.as_posix(),
        encoding="UTF-8",
        maxBytes=1048576,
        backupCount=1000,
    )

    # ログファイル設定
    handler.setLevel(INFO)
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # 標準出力用 設定
    sthandler = StreamHandler()
    sthandler.setLevel(INFO)
    sthandler.setFormatter(formatter)
    logger.addHandler(sthandler)
    return logger
