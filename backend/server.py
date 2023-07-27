import argparse
import uvicorn
from multiprocessing import cpu_count

parser = argparse.ArgumentParser(description="Startup arguments.")
parser.add_argument(
    "--reload", type=bool, help="activate reload option", nargs="?", const=False
)
args = parser.parse_args()

RELOAD = args.reload


def start_server(
    host="127.0.0.1", port=8000, num_workers=4, loop="asyncio", reload=RELOAD
):
    uvicorn.run(
        "api:app", host=host, port=port, workers=num_workers, loop=loop, reload=reload
    )


if __name__ == "__main__":
    num_workers = int(cpu_count() * 0.75)
    start_server(num_workers=num_workers)
