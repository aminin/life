import os, time, copy, random

def print_matrix(W):
    for i in range(len(W)):
        for j in range(len(W[i])):
            print (' ', '+')[W[i][j]],
            #print(W[i][j], end=' ')
        print
        #print()

def neighbours_count(W, i, j):
    count = 0
    for h in range(i-1, i+2):
        if h < 0 or h >= len(W):
            continue
        for k in range(j-1, j+2):
            if k < 0 or k >= len(W[h]):
                continue
            if (h == i) and (k == j):
                continue
            count += W[h][k]
    return count

def make_matrix(N, seed):
    a = []
    for i in range(N):
        a.append([])
        for j in range(N):
            a[i].append(random.choice(seed))
    return a

W=make_matrix(50, [0, 1])
#W=[[0,1],[1,0]]
#W=[[0,1,0],[1,0,0],[0,0,1]]

os.system('clear')
print('Initial state:')
print_matrix(W)
time.sleep(3)

step = 1

while True:
    os.system('clear')
    w = copy.deepcopy(W)
    for i in range(len(W)):
        for j in range(len(W[i])):
            a = neighbours_count(W, i, j)
            if a==2:
                w[i][j]=1
            if a > 3 or a < 2:
                w[i][j]=0
    W = w

    print('Step %d' % step)
    print_matrix(W)
    print('Press Ctrl+C to exit')
    time.sleep(2)
    step += 1
    if sum(map(sum, W)) == 0:
        break
